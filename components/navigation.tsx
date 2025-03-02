'use client'
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Paper } from "@mui/material";;
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from 'next/navigation'

export default function Navigation() {

  const router = useRouter();
  const pathName = usePathname();

  const [value, setValue] = useState(pathName == '/budget' ? 0 : 1);


  return (
    <Box sx={{ width: 500 }} suppressHydrationWarning={true}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            if (newValue == 2) {
              signOut()
            } else {
              setValue(newValue);
              router.push(newValue == 0 ? '/budget' : '/transactions')
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