'use client'
import { useState } from "react";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Paper } from "@mui/material";

export default function Navigation() {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ width: 500 }}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="budget" icon={<AccountBalanceIcon />} />
          <BottomNavigationAction label="transactions" icon={<ReceiptLongIcon />} />
        </BottomNavigation>

      </Paper>
    </Box >
  )
}