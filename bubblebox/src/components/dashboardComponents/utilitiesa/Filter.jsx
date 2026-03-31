import { MenuItem } from "@mui/material";
import Select from '@mui/material/Select';

export default function Filter({filters, onChange, listNames}) {

    return(
        <div className="filter-select">
            <Select value={filters.priority} onChange={e=>{onChange({    ...filters, priority: e.target.value}); console.log("filter change", e.target.value)}}
                >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="0">Priority 0</MenuItem>
                <MenuItem value="1">Priority 1</MenuItem>
                <MenuItem value="2">Priority 2</MenuItem>
                <MenuItem value="3">Priority 3</MenuItem>
                <MenuItem value="4">Priority 4</MenuItem>
            </Select>
        </div>
    )}