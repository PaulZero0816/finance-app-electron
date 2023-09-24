import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import QueueIcon from '@mui/icons-material/Queue';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@mui/material';
import { Detail, Source } from 'type/index';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useFilePicker } from 'use-file-picker';
import Papa from 'papaparse';

const drawerWidth = 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { openFilePicker, plainFiles, loading } = useFilePicker({
    multiple: false,
    readAs: 'DataURL', // availible formats: "Text" | "BinaryString" | "ArrayBuffer" | "DataURL"
    // accept: '.ics,.pdf',
    accept: ['.csv', '.xls'],
  });

  if (!loading && plainFiles && plainFiles.length > 0) {
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target!.result, { header: true });
      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      console.log(parsedData, columns);
    };
    reader.readAsText(plainFiles[0]);
  }

  const [open, setOpen] = React.useState(false);
  const [newValue, setNewValue] = React.useState<Partial<Detail> | null>(null);
  const source = window.electron.store.get('source') as Source[];
  const details = window.electron.store.get('details') as Detail[];
  const { enqueueSnackbar } = useSnackbar();
  const totalValue = source.reduce((acc, v) => {
    return acc + v.value || 0;
  }, 0);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const columns = React.useMemo<MRT_ColumnDef<Detail>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: '记录时间',
      },
      {
        accessorKey: 'source',
        Cell: ({ cell }) => {
          const s = source.find((v) => v.id === (cell.getValue() as string));
          return <>{s?.name || '不知道'}</>;
        },
        header: '来源账号',
      },
      {
        accessorKey: 'transactionTime',
        header: '记录时间',
      },
      {
        accessorKey: 'diffValue',
        Cell: ({ renderedCellValue, cell }) => (
          <strong
            style={{ color: (cell.getValue() as number) > 0 ? 'green' : 'red' }}
          >
            {renderedCellValue}
          </strong>
        ),
        header: '金额',
      },
      {
        accessorKey: 'targetAccount',
        header: '目标账户',
      },
      {
        accessorKey: 'description',
        header: '描述',
      },
      {
        accessorKey: 'type',
        header: '类型',
      },
    ],
    [],
  );
  console.log(newValue);
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            资产管理系统
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key={'主页'} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/');
              }}
            >
              <ListItemIcon>
                <DashboardCustomizeIcon />
              </ListItemIcon>
              <ListItemText primary={'主页'} />
            </ListItemButton>
          </ListItem>
          <ListItem key={'账号管理'} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/account-management');
              }}
            >
              <ListItemIcon>
                <AccountBalanceWalletIcon />
              </ListItemIcon>
              <ListItemText primary={'账号管理'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Drawer
        sx={{ width: 500 }}
        anchor={'right'}
        open={newValue !== null}
        onClose={() => setNewValue(null)}
      >
        <DrawerHeader>
          <Typography>添加一条记录</Typography>
        </DrawerHeader>
        <Divider />
        <TextField
          style={{ width: '300px', margin: '20px' }}
          select
          required
          value={newValue?.source}
          onChange={(e) => {
            setNewValue({ ...newValue, source: e.target.value });
          }}
          SelectProps={{
            native: true,
          }}
          helperText="选择账号"
        >
          <option key={undefined} value={undefined}>
            {`请选择账号`}
          </option>
          {source.map((option) => (
            <option key={option.id} value={option.id}>
              {`${option.name} ${option.bankName}`}
            </option>
          ))}
        </TextField>
        <TextField
          id="date"
          label="交易时间"
          helperText="交易时间"
          type="datetime-local"
          style={{ width: '300px', margin: '20px' }}
          InputLabelProps={{
            shrink: true,
          }}
          value={newValue?.transactionTime}
          onChange={(e) => {
            setNewValue({ ...newValue, transactionTime: e.target.value });
          }}
        />
        <TextField
          type="number"
          style={{ width: '300px', margin: '20px' }}
          label="金额变化，支出用-"
          helperText="金额变化"
          required
          value={newValue?.diffValue}
          onChange={(e) => {
            setNewValue({ ...newValue, diffValue: Number(e.target.value) });
          }}
        />
        <TextField
          type="number"
          style={{ width: '300px', margin: '20px' }}
          label="余额"
          helperText="余额"
          value={newValue?.remain}
          onChange={(e) => {
            setNewValue({ ...newValue, remain: Number(e.target.value) });
          }}
        />
        <TextField
          style={{ width: '300px', margin: '20px' }}
          label="目标账户"
          helperText="目标账户"
          value={newValue?.targetAccount}
          onChange={(e) => {
            setNewValue({ ...newValue, targetAccount: e.target.value });
          }}
        />
        <TextField
          style={{ width: '300px', margin: '20px' }}
          label="描述"
          helperText="描述"
          value={newValue?.description}
          onChange={(e) => {
            setNewValue({ ...newValue, description: e.target.value });
          }}
        />
        <TextField
          style={{ width: '300px', margin: '20px' }}
          label="类型"
          helperText="类型"
          value={newValue?.type}
          onChange={(e) => {
            setNewValue({ ...newValue, type: e.target.value });
          }}
        />
        <Grid container alignItems={'flex-end'} justifyContent={'space-around'}>
          <Grid xs={5}>
            <Button
              variant="contained"
              onClick={() => {
                if (!newValue) {
                  return;
                }
                if (!newValue.source) {
                  enqueueSnackbar('来源必须选择', { variant: 'error' });
                  return;
                }
                if (!newValue.diffValue) {
                  enqueueSnackbar('金额必须填写', { variant: 'error' });
                  return;
                }
                if (!newValue.transactionTime) {
                  enqueueSnackbar('交易时间必须填写', { variant: 'error' });
                  return;
                }
                const now = new Date();
                newValue.createdAt = now.toISOString();
                window.electron.store.set('details', [newValue, ...details]);
                enqueueSnackbar('创建成功', { variant: 'success' });
                setNewValue(null);
              }}
            >
              添加
            </Button>
          </Grid>
          <Grid xs={5}>
            <Button
              onClick={() => setNewValue(null)}
              variant="contained"
              color="error"
            >
              取消
            </Button>
          </Grid>
        </Grid>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Grid container justifyContent={'space-around'} rowGap={4}>
          <Grid xs={5}>
            <Card style={{ height: '200px' }}>
              <CardHeader title={'总资产'} />
              <CardContent>
                <Typography
                  sx={{ fontSize: 40 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {`￥${totalValue}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={6}>
            <Card style={{ height: '200px' }}>
              <CardHeader title={'各账号资产'} />
              <CardContent style={{ height: '100px', overflowY: 'scroll' }}>
                <Grid container>
                  <Grid xs={2}>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {'源头'}
                    </Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {'名称'}
                    </Typography>
                  </Grid>
                  <Grid xs={4}>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {'资产'}
                    </Typography>
                  </Grid>
                </Grid>
                {source.map((v) => {
                  return (
                    <Grid container>
                      <Grid xs={2}>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {v.bankName}
                        </Typography>
                      </Grid>
                      <Grid xs={6} style={{ overflowX: 'hidden' }}>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {v.name}
                        </Typography>
                      </Grid>
                      <Grid xs={4}>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {`￥${v.value}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
          <Grid container justifyContent={'flex-end'}>
            <Button
              variant="outlined"
              startIcon={<QueueIcon />}
              style={{ marginRight: '10px' }}
              onClick={() => {
                openFilePicker();
              }}
            >
              批量导入文件
            </Button>
            <Button
              onClick={() => {
                setNewValue({});
              }}
              variant="outlined"
              startIcon={<AddCircleIcon />}
            >
              记录一个
            </Button>
          </Grid>
          <Grid xs={12}>
            <MaterialReactTable
              enableSelectAll={false}
              enableRowSelection={false}
              enableSubRowSelection={false}
              enableMultiRowSelection={false}
              columns={columns}
              data={details}
              enableColumnOrdering
              enableGlobalFilter={false} //turn off a feature
            />
          </Grid>
        </Grid>
      </Main>
    </Box>
  );
}
