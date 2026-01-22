import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PrintIcon from '@mui/icons-material/Print';
import { Link } from 'react-router-dom';
import ItemTable from '../components/ItemTable';
import { getItems, deleteItem } from '../api/itemsApi';

function InventoryList() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.id.toString().includes(query)
    );
  }, [items, searchQuery]);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSnackbar({
        open: true,
        message: 'Item deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to delete item',
        severity: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePrint = () => {
    const itemsToPrint = filteredItems.length > 0 ? filteredItems : items;
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>RBC Inventory Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #1A1A1A;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #0051A5;
            }
            .logo {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .logo-icon {
              width: 40px;
              height: 40px;
              background: #0051A5;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FECC00;
              font-weight: bold;
              font-size: 18px;
            }
            .company-name {
              font-size: 24px;
              font-weight: 700;
              color: #0051A5;
            }
            .report-title {
              font-size: 14px;
              color: #5C6670;
            }
            .date {
              text-align: right;
              font-size: 12px;
              color: #5C6670;
            }
            h1 {
              font-size: 20px;
              margin-bottom: 5px;
            }
            .summary {
              margin-bottom: 20px;
              font-size: 14px;
              color: #5C6670;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              padding: 12px 8px;
              text-align: left;
              border-bottom: 1px solid #E0E4E8;
            }
            th {
              background: #F5F7FA;
              font-weight: 600;
              color: #1A1A1A;
              font-size: 12px;
              text-transform: uppercase;
            }
            td { font-size: 14px; }
            tr:hover { background: #FAFBFC; }
            .quantity { text-align: center; }
            .quantity-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-weight: 500;
              font-size: 12px;
            }
            .qty-ok { background: #E8F5E9; color: #2E7D32; }
            .qty-low { background: #FFF3E0; color: #E65100; }
            .qty-out { background: #FFEBEE; color: #C62828; }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #E0E4E8;
              font-size: 11px;
              color: #5C6670;
              text-align: center;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <div class="logo-icon">RBC</div>
              <div>
                <div class="company-name">RBC Inventory</div>
                <div class="report-title">Inventory Report</div>
              </div>
            </div>
            <div class="date">
              <div>Generated on</div>
              <div><strong>${currentDate}</strong></div>
            </div>
          </div>

          <div class="summary">
            Total items: <strong>${itemsToPrint.length}</strong>
            ${searchQuery ? ` (filtered by "${searchQuery}")` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th class="quantity">Quantity</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${itemsToPrint.map(item => {
                const qtyClass = item.quantity === 0 ? 'qty-out' : item.quantity < 10 ? 'qty-low' : 'qty-ok';
                const createdDate = item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }) : '-';
                return `
                  <tr>
                    <td>#${item.id}</td>
                    <td>${item.name}</td>
                    <td class="quantity"><span class="quantity-badge ${qtyClass}">${item.quantity}</span></td>
                    <td>${createdDate}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            Royal Bank of Canada - Inventory Management System
          </div>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchItems}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Inventory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your inventory items
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={items.length === 0}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchItems}
          >
            Refresh
          </Button>
          <Button
            component={Link}
            to="/add"
            variant="contained"
            startIcon={<AddCircleIcon />}
          >
            Add Item
          </Button>
        </Box>
      </Box>

      {/* Content */}
      {items.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No items yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start by adding your first inventory item
          </Typography>
          <Button
            component={Link}
            to="/add"
            variant="contained"
            startIcon={<AddCircleIcon />}
          >
            Add First Item
          </Button>
        </Paper>
      ) : (
        <>
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search items by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      onClick={handleClearSearch}
                      sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                      <ClearIcon fontSize="small" />
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchQuery
              ? `${filteredItems.length} of ${items.length} item${items.length !== 1 ? 's' : ''} matching "${searchQuery}"`
              : `${items.length} item${items.length !== 1 ? 's' : ''} in inventory`}
          </Typography>

          {filteredItems.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                No items found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search term
              </Typography>
            </Paper>
          ) : (
            <ItemTable items={filteredItems} onDelete={handleDelete} isDeleting={isDeleting} />
          )}
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default InventoryList;
