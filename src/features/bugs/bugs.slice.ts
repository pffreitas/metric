import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment';
import { Bug, Changelog, ChangelogEntry, CycleTimeEntry } from '../../models/bugs';
import { chain, filter, reduce } from 'lodash';
import { MonetizationOn } from '@mui/icons-material';

const initialState = {
  escapedBugs: <Bug[]>[],
  loading: false,
}
const token = 'ONHYfzUseBOFs4IOGni46744';

const paginated_fetch = async (url: string, startAt = 0, prevResponse: any[] = []) => {
  const pageSize = 100;
  const data = await fetch(
    `${url}&startAt=${startAt}&maxResults=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa('whooops')}`,
        'Accept': 'application/json'
      }
    })
    .then(data => data.json());

  const response = [...prevResponse, ...data.issues];

  if (data.issues && data.issues.length !== 0) {
    startAt += pageSize;
    return paginated_fetch(url, startAt, response);
  }

  return response;
}


export const getBugs = createAsyncThunk(
  'bugs/get',
  async (thunkAPI) => {
    // OR project = "BEES - Checkout"
    const jql = '(project = "BEES - Cart") AND issuetype = Bug and created > 2022-01-01 order by created desc'
    const res = await paginated_fetch(`https://ab-inbev.atlassian.net/rest/api/2/search?fieldsByKeys=true&expand=changelog&fields=resolutiondate,created,resolved,priority,summary,status,customfield_13464&jql=${jql}`)

    const bugs: Bug[] = res.map((i: any) => {
      const environments = i.fields.customfield_13464 && i.fields.customfield_13464.map((f: any) => f.value) as string[]

      const changelogEntries = <ChangelogEntry[]>[{
        created: moment(i.fields.created).toDate(),
        field: 'status',
        from: 'new',
        to: 'created',
      }];

      i.changelog.histories.forEach((h: any) => {
        const created = moment(h.created).toDate();
        const entries = h.items.map((e: any) => {
          return {
            created,
            field: e.field,
            from: e.fromString,
            to: e.toString
          } as ChangelogEntry;
        });
        changelogEntries.push(...entries);
      });


      const resolutionDate = i.fields.resolutiondate ? moment(i.fields.resolutiondate) : moment();
      changelogEntries.push({
        created: resolutionDate.toDate(),
        field: 'status',
        from: '-',
        to: '-',
      });

      const cycleTime = chain(changelogEntries)
        .filter(e => e.field === 'status')
        .sortBy(e => e.created)
        .map(e => ({ created: e.created, phase: e.to, spent: 0 } as CycleTimeEntry))
        .value();


      for (let i = 0; i < cycleTime.length - 1; i++) {
        const c = cycleTime[i];
        const cNext = cycleTime[i + 1];
        const spent = moment(cNext.created).diff(moment(c.created), 'hours');
        c.spent = spent;
      }

      return {
        id: i.key,
        summary: i.fields.summary,
        environment: environments,
        priority: i.fields.priority.name,
        status: i.fields.status.name,
        created: moment(i.fields.created).toDate(),
        resolved: moment(i.fields.resolutiondate || new Date()).toDate(),
        changelog: { entries: changelogEntries },
        cycleTime: { entries: cycleTime },
      } as Bug;
    })

    const escapedBugs = filter(bugs,
      b => b.environment && (b.environment.includes("PROD") || b.environment.includes("UAT")));


    return escapedBugs
  })


export const bugs = createSlice({
  name: 'bugs',
  initialState,
  reducers: {},
  extraReducers: {
    [getBugs.pending]: (state) => {
      state.loading = true
    },
    [getBugs.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.escapedBugs = payload
    },
    [getBugs.rejected]: (state) => {
      state.loading = false
    },
  },
})

