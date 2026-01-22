import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { getItemEvents } from '../api/itemsApi';

const eventTypeConfig = {
  item_created: {
    label: 'Created',
    color: 'success',
    icon: <AddCircleIcon fontSize="small" />,
  },
  item_updated: {
    label: 'Updated',
    color: 'primary',
    icon: <EditIcon fontSize="small" />,
  },
  item_deleted: {
    label: 'Deleted',
    color: 'error',
    icon: <DeleteIcon fontSize="small" />,
  },
};

function EventHistoryModal({ open, onClose, itemId, itemName }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && itemId) {
      fetchEvents();
    }
  }, [open, itemId]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getItemEvents(itemId);
      setEvents(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventConfig = (eventType) => {
    return eventTypeConfig[eventType] || {
      label: eventType,
      color: 'default',
      icon: <HistoryIcon fontSize="small" />,
    };
  };

  const renderPayload = (payload) => {
    if (!payload || Object.keys(payload).length === 0) {
      return <Typography variant="body2" color="text.secondary">No additional data</Typography>;
    }

    return (
      <Box sx={{ mt: 1 }}>
        {Object.entries(payload).map(([key, value]) => (
          <Box key={key} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80 }}>
              {key}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon color="primary" />
        <Box>
          <Typography variant="h6">Event History</Typography>
          {itemName && (
            <Typography variant="body2" color="text.secondary">
              {itemName}
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ minHeight: 300 }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {!isLoading && !error && events.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">No events found</Typography>
          </Box>
        )}

        {!isLoading && !error && events.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {events.map((event, index) => {
              const config = getEventConfig(event.event_type);
              return (
                <Accordion key={event.id} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Chip
                        icon={config.icon}
                        label={config.label}
                        color={config.color}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                        {formatDate(event.created_at)}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                    {renderPayload(event.payload)}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} startIcon={<CloseIcon />} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventHistoryModal;
