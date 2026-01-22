import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ItemForm from '../components/ItemForm';
import { getItem, updateItem } from '../api/itemsApi';

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    setIsLoadingItem(true);
    setLoadError(null);
    try {
      const data = await getItem(id);
      setItem(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setLoadError('Item not found');
      } else {
        setLoadError(err.response?.data?.message || 'Failed to load item');
      }
    } finally {
      setIsLoadingItem(false);
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await updateItem(id, data);
      navigate('/', { state: { message: 'Item updated successfully' } });
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const messages = Object.values(errors).flat().join('. ');
        setApiError(messages);
      } else if (err.response?.status === 404) {
        setApiError('Item not found. It may have been deleted.');
      } else {
        setApiError(err.response?.data?.message || 'Failed to update item');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingItem) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ py: 4, maxWidth: 600, mx: 'auto' }}>
        <Alert
          severity="error"
          action={
            <Button component={Link} to="/" color="inherit" size="small">
              Back to List
            </Button>
          }
        >
          {loadError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          color="inherit"
        >
          <HomeIcon fontSize="small" />
          Inventory
        </MuiLink>
        <Typography color="text.primary">Edit Item</Typography>
      </Breadcrumbs>

      {/* Form */}
      <ItemForm
        initialData={item}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        apiError={apiError}
      />
    </Box>
  );
}

export default EditItem;
