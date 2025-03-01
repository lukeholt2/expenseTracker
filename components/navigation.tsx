'use client'
import { useContext, useState } from "react";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Paper } from "@mui/material";
import { HomeContext } from "@/app/homeContext";
import { signOut } from "next-auth/react";

export default function Navigation() {
  const [value, setValue] = useState(0);

  const dispatch = useContext(HomeContext)

  return (
    <Box sx={{ width: 500 }}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            if (newValue == 2) {
              signOut()
            } else {
              setValue(newValue);
              dispatch({ state: newValue == 0 ? 'budget' : 'transactions' })
            }
          }}
        >
          <BottomNavigationAction label="budget" icon={<AccountBalanceIcon />} />
          <BottomNavigationAction label="transactions" icon={<ReceiptLongIcon />} />
          <BottomNavigationAction label="logout" icon={<ExitToAppIcon />} />
        </BottomNavigation>

      </Paper>
    </Box >
  )
}