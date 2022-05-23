type Issue = {
    id: string;
    summary: string;
    environment: string[];
    priority: string;
    status: string;
    created: Date;
    resolved: Date;
    changelog: Changelog;
    cycleTime: CycleTime;
}

type Bug = Issue & {
}


type Changelog = { 
    entries: ChangelogEntry[]; 
}

type ChangelogEntry = { 
    created: Date;
    field: string;
    from: string;
    to: string;
}

type CycleTime = { 
    entries: CycleTimeEntry[]; 
}

type CycleTimeEntry = { 
    created: Date;
    phase: string;
    spent: number;
}

export {
    Issue, Bug, Changelog, ChangelogEntry, CycleTime, CycleTimeEntry
}