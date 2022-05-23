import React from "react"
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { Link } from 'react-router-dom'
import BugIcon from "@mui/icons-material/BugReport";
import DashboardIcon from "@mui/icons-material/Dashboard";

type MenuProps = {
    open: boolean;
}

type MenuItem = {
    text: string;
    link: string;
    icon: React.ReactElement;
}

export const Menu: React.FunctionComponent<MenuProps> = ({ open }) => {

    const items: MenuItem[] = [
        { text: "Home", link: "/", icon: <DashboardIcon /> },
        { text: "Bugs", link: "bugs", icon: <BugIcon /> },   
    ]

    return (
        <List>
            {items.map(({text, link, icon}) => (
                <Link to={link}>
                    <ListItemButton
                        key={text}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}>
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </Link>
            ))}
        </List>

    )
}