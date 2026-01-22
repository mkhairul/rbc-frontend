import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function ItemForm({ initialData = null, onSubmit, isLoading = false, apiError = null }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        quantity: initialData.quantity?.toString() || '',
      });
    }
  }, [initialData]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        }
        if (value.length > 255) {
          return 'Name must be 255 characters or less';
        }
        return '';
      case 'quantity':
        if (value === '') {
          return 'Quantity is required';
        }
        const num = parseInt(value, 10);
        if (isNaN(num)) {
          return 'Quantity must be a number';
        }
        if (num < 0) {
          return 'Quantity cannot be negative';
        }
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      quantity: validateField('quantity', formData.quantity),
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.quantity;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, quantity: true });
    
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        quantity: parseInt(formData.quantity, 10),
      });
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const isEditMode = !!initialData;

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Item' : 'Add New Item'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {isEditMode
            ? 'Update the item details below.'
            : 'Fill in the details to add a new inventory item.'}
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {apiError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            placeholder="Enter item name"
            sx={{ mb: 3 }}
            disabled={isLoading}
            inputProps={{ maxLength: 255 }}
          />

          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.quantity && !!errors.quantity}
            helperText={touched.quantity && errors.quantity}
            placeholder="Enter quantity"
            sx={{ mb: 4 }}
            disabled={isLoading}
            inputProps={{ min: 0 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Item' : 'Add Item'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ItemForm;
