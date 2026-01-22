import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ItemForm from '../components/ItemForm';
import { createItem } from '../api/itemsApi';

function AddItem() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await createItem(data);
      navigate('/', { state: { message: 'Item created successfully' } });
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const messages = Object.values(errors).flat().join('. ');
        setApiError(messages);
      } else {
        setApiError(err.response?.data?.message || 'Failed to create item');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        <Typography color="text.primary">Add Item</Typography>
      </Breadcrumbs>

      {/* Form */}
      <ItemForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        apiError={apiError}
      />
    </Box>
  );
}

export default AddItem;
