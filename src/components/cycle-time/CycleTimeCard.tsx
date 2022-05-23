import { FunctionComponent, useState } from 'react'
import Popover from '@mui/material/Popover';
import ButtonBase from '@mui/material/ButtonBase';
import { CycleTimeEntry } from '../../models/bugs';
import { chain, map } from 'lodash';
import styled from 'styled-components';
import { Typography } from '@mui/material';

type CycleTimeProps = {
    entries: CycleTimeEntry[];
}

// 4: {key: "Cancelled", avg: 1.3113207547169812}
// 16: {key: "In Production", avg: 0}
// 17: {key: "Blocked", avg: 0.6666666666666666}

const Mapping: { [k: string]: string } = {
    'created': 'BACKLOG',
    'TO DO': 'BACKLOG',
    'Product Backlog': 'BACKLOG',
    'In Business Analysis': 'ANALYSIS',
    'In Analysis': 'ANALYSIS',
    'In Technical Analysis': 'ANALYSIS',
    'Ready For Development': 'ANALYSIS',
    'In Development': 'CODE',
    'In Progress': 'CODE',
    'Available for Code Review': 'CODE',
    'Developed': 'TEST',
    'Tested': 'TEST',
    'Approved for SIT': 'TEST',
    'SIT Done': 'TEST',
    'Approved for UAT': 'DEPLOY',
    'UAT Done': 'DEPLOY',
    'In Production': 'DEPLOY',
}

const CycleTimeList = styled(`ul`)(() => ({
    display: 'flex',
    height: '70px',
}));

const Step = styled.li`
    list-style-type: none;
    width: 120px;

    &:not(:last-child):after {
        content: " ";
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='700pt' height='700pt' version='1.1' viewBox='0 0 700 700' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='m220.78 0-26.336 26.336 253.89 253.89-247.84 253.75 26.645 26.023 273.56-280.07z' fill-rule='evenodd'/%3E%3C/g%3E%3C/svg%3E%0A");
        float: right;
        width: 20px;
        display: inline-block;
        position: relative;
        height: 20px;
        background-size: cover;
        top: -42px;
        left: 10px;
    }
`;


const StepName = styled(`p`)(() => ({
    color: '#aaa',
    fontSize: '0.86em',

}));

const StepValue = styled(`p`)(() => ({
    fontWeight: '900',
    fontSize: '1em',
}));

const StepValueLabel = styled(`small`)(() => ({
    fontWeight: 'normal',
    color: '#777',
    textTransform: 'uppercase',
    fontSize: '0.66em',
}));

const StepButton = styled(ButtonBase)(({ theme }) => ({
    display: 'block',
    width: '100%',
    height: '100%',
}));

const CycleTimeCard: FunctionComponent<CycleTimeProps> = ({ entries }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [key, setKey] = useState<string>('');
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, key: string) => {
        setAnchorEl(event.currentTarget);
        setKey(key);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setKey('');
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    const bla: { [k: string]: number } = { "BACKLOG": 0, "ANALYSIS": 0, "CODE": 0, "TEST": 0, "DEPLOY": 0 }

    const highlevelEntries = chain(entries)
        .reduce((e, x) => {
            const highlevelPhase = Mapping[(x.phase)];
            if (highlevelPhase) {
                e[highlevelPhase] = e[highlevelPhase] + x.spent;
            }
            return e;
        }, bla)
        .value();


    return (
        <>
            <CycleTimeList>
                {map(highlevelEntries, (v, k) => (
                    <Step>
                        <StepButton aria-describedby={id} onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClick(event, k)} >
                            <StepName>{k}</StepName>
                            <StepValue>
                                {v}
                                <StepValueLabel> hours</StepValueLabel>
                            </StepValue>
                        </StepButton>
                    </Step>
                ))}
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Typography sx={{ p: 2 }}>{key}</Typography>
                </Popover>
            </CycleTimeList>
        </>
    )
}

export default CycleTimeCard;