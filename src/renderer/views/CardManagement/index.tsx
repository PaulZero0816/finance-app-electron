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
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from '@mui/material';
import { Source } from 'type/index';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
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

  const [open, setOpen] = React.useState(false);
  const [newValue, setNewValue] = React.useState<Partial<Source> | null>(null);
  const source = window.electron.store.get('source') as Source[];
  const { enqueueSnackbar } = useSnackbar();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
            账户管理
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
          <Typography>{newValue?.id ? '编辑' : '新增'}一个账户</Typography>
        </DrawerHeader>
        <Divider />
        <TextField
          style={{ width: '300px', margin: '20px' }}
          label="银行名称"
          helperText="银行名称"
          value={newValue?.bankName}
          onChange={(e) => {
            setNewValue({ ...newValue, bankName: e.target.value });
          }}
        />
        <TextField
          style={{ width: '300px', margin: '20px' }}
          label="名称"
          helperText="名称"
          required
          value={newValue?.name}
          onChange={(e) => {
            setNewValue({ ...newValue, name: e.target.value });
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
          type="number"
          style={{ width: '300px', margin: '20px' }}
          label="余额"
          helperText="余额"
          required
          value={newValue?.value}
          onChange={(e) => {
            setNewValue({ ...newValue, value: Number(e.target.value) });
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
                if (!newValue.name) {
                  enqueueSnackbar('名称必须填写', { variant: 'error' });
                  return;
                }
                if (newValue?.value === undefined) {
                  enqueueSnackbar('余额必须填写', { variant: 'error' });
                  return;
                }
                const createNew = newValue.id ? false : true;
                const now = new Date();
                let newSource = [...source];
                if (newValue.id) {
                  // edit
                  const index = source.findIndex((v) => v.id === newValue.id);
                  newSource[index] = newValue as Source;
                } else {
                  // create new
                  newValue.id = uuid();
                  newSource.push(newValue as Source);
                }
                window.electron.store.set('source', newSource);
                enqueueSnackbar(createNew ? '创建成功' : '编辑成功', {
                  variant: 'success',
                });
                setNewValue(null);
              }}
            >
              保存
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
        <div style={{ marginTop: '80px' }}>
          <Grid container justifyContent={'left'} rowGap={3} columnGap={3}>
            {source.map((v) => {
              return (
                <Grid xs={5}>
                  <Card style={{ minHeight: '200px' }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {`${v.bankName} ${v.name}`}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        {`￥${v.value}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {v.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={() => {
                          setNewValue(v);
                        }}
                        size="small"
                      >
                        编辑
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
            <Grid xs={5}>
              <Button
                onClick={() => {
                  setNewValue({});
                }}
                size="large"
              >
                添加新的账号
              </Button>
            </Grid>
          </Grid>
        </div>
      </Main>
    </Box>
  );
}
