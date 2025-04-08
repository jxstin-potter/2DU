import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { useWebSocket } from '../../contexts/WebSocketContext';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

const WebSocketStatus: React.FC = () => {
  const { isConnected } = useWebSocket();

  return (
    <Tooltip title={isConnected ? 'Connected to real-time updates' : 'Disconnected from real-time updates'}>
      <Chip
        icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
        label={isConnected ? 'Connected' : 'Disconnected'}
        color={isConnected ? 'success' : 'error'}
        size="small"
        sx={{ mr: 1 }}
      />
    </Tooltip>
  );
};

export default WebSocketStatus; 