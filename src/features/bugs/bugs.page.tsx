import { useEffect } from 'react'
import { RootState } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import { getBugs } from './bugs.slice';
import { EscapedBugsChart } from '../../components/bugs/EscapedBugs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Grid, Box, Paper } from '@mui/material';
import { CycleTimeEntry } from '../../models/bugs';
import { chain, reduce, ceil } from 'lodash';
import CycleTimeCard from '../../components/cycle-time/CycleTimeCard';

export function BugsPage() {
    // import animationData from '../../lotties/loading.json';
    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: animationData,
    //     rendererSettings: {
    //       preserveAspectRatio: "xMidYMid slice"
    //     }
    //   };    
    //     <div>
    //     {loading && (
    //       <Lottie
    //         options={defaultOptions}
    //         height={120}
    //         width={120}
    //       />
    //     )}
    //   </div>

    const { loading, escapedBugs } = useSelector((state: RootState) => state.bugs)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getBugs())
    }, []);

    const allCycleTimeEntries = chain(escapedBugs)
        .map(e => e.cycleTime.entries)
        .flatten()
        .value();

    const cycletimeByPhase = chain(allCycleTimeEntries)
        .groupBy((c) => c.phase)
        .map((lst, key) => {
            const total = reduce(lst, (sum, prev) => sum + prev.spent, 0);
            const avg = total / lst.length;
            return { phase: key, spent: ceil(avg), created: new Date() } as CycleTimeEntry;
        })
        .value();


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <EscapedBugsChart escapedBugs={escapedBugs} />
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={1}>
                    <CycleTimeCard entries={cycletimeByPhase} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell size="small">Key</TableCell>
                                    <TableCell>Summary</TableCell>
                                    <TableCell size="small">Status</TableCell>
                                    <TableCell size="small">Priority</TableCell>
                                    <TableCell size="small">Total Cycle Time</TableCell>
                                    <TableCell size="medium">Cycle Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {escapedBugs.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell >{row.id}</TableCell>
                                        <TableCell size="small"><p>{row.summary}</p></TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>{row.priority}</TableCell>
                                        <TableCell>{chain(row.cycleTime.entries).map(e => e.spent).sum().value()}</TableCell>
                                        <TableCell><CycleTimeCard entries={row.cycleTime.entries} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    )
}