import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import { IconSearch, IconShoppingCart } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';

// Importar imágenes de productos
import s11 from '../../../assets/images/products/s11.jpg';
import s5 from '../../../assets/images/products/s5.jpg';
import s4 from '../../../assets/images/products/s4.jpg';
import s6 from '../../../assets/images/products/s6.jpg';
import s7 from '../../../assets/images/products/s7.jpg';
import s8 from '../../../assets/images/products/s8.jpg';
import s9 from '../../../assets/images/products/s9.jpg';
import s10 from '../../../assets/images/products/s10.jpg';

// Datos de productos adaptados para puntos
const pointsProducts = [
  {
    id: 1,
    title: 'Cute Soft Teddybear',
    photo: s11,
    points: 12000,
    price: 300,
    rating: 5,
    category: 'Juguetes',
    company: 'ToyStore',
  },
  {
    id: 2,
    title: 'MacBook Air Pro',
    photo: s5,
    points: 45000,
    price: 1200,
    rating: 5,
    category: 'Electrónicos',
    company: 'TechCorp',
  },
  {
    id: 3,
    title: 'Gaming Console',
    photo: s4,
    points: 25000,
    price: 500,
    rating: 5,
    category: 'Electrónicos',
    company: 'GameZone',
  },
  {
    id: 4,
    title: 'Wireless Headphones',
    photo: s6,
    points: 8000,
    price: 200,
    rating: 4,
    category: 'Electrónicos',
    company: 'AudioTech',
  },
  {
    id: 5,
    title: 'Smart Watch',
    photo: s7,
    points: 15000,
    price: 350,
    rating: 4,
    category: 'Electrónicos',
    company: 'WearableTech',
  },
  {
    id: 6,
    title: 'Bluetooth Speaker',
    photo: s8,
    points: 6000,
    price: 150,
    rating: 4,
    category: 'Electrónicos',
    company: 'AudioTech',
  },
  {
    id: 7,
    title: 'Gaming Mouse',
    photo: s9,
    points: 4000,
    price: 100,
    rating: 4,
    category: 'Electrónicos',
    company: 'GameZone',
  },
  {
    id: 8,
    title: 'Mechanical Keyboard',
    photo: s10,
    points: 7000,
    price: 175,
    rating: 4,
    category: 'Electrónicos',
    company: 'TechCorp',
  },
];

const StoreContent = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
  const [selectedCompany, setSelectedCompany] = useState('Todas las empresas');

  // Filtrar productos
  const filteredProducts = pointsProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas las categorías' || product.category === selectedCategory;
    const matchesCompany =
      selectedCompany === 'Todas las empresas' || product.company === selectedCompany;

    return matchesSearch && matchesCategory && matchesCompany;
  });

  const handleRedeemPoints = (product) => {
    // Aquí iría la lógica para canjear puntos
    console.log('Canjeando puntos por:', product.title);
  };

  return (
    <Box>
      {/* Contenedor blanco padre - igual que en Conversión */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: '1px solid',
          borderColor: theme.palette.divider,
          borderRadius: '15px',
          padding: '6px',
          boxShadow: theme.shadows[1],
          mb: 3,
          p: 4,
        }}
      >
        {/* Header de la tienda */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} color="text.primary" mb={5}>
            <strong>Tienda Virtual de Puntos</strong>
          </Typography>

          {/* Filtros y búsqueda */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Categorías</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Categorías"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="Todas las categorías">Todas las categorías</MenuItem>
                  <MenuItem value="Juguetes">Juguetes</MenuItem>
                  <MenuItem value="Electrónicos">Electrónicos</MenuItem>
                  <MenuItem value="Ropa">Ropa</MenuItem>
                  <MenuItem value="Hogar">Hogar</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Empresas</InputLabel>
                <Select
                  value={selectedCompany}
                  label="Empresas"
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <MenuItem value="Todas las empresas">Todas las empresas</MenuItem>
                  <MenuItem value="ToyStore">ToyStore</MenuItem>
                  <MenuItem value="TechCorp">TechCorp</MenuItem>
                  <MenuItem value="GameZone">GameZone</MenuItem>
                  <MenuItem value="AudioTech">AudioTech</MenuItem>
                  <MenuItem value="WearableTech">WearableTech</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Grid de productos */}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                {/* Imagen del producto */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.photo}
                    alt={product.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  {/* Icono de carrito en la esquina */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    <IconShoppingCart size={16} color={theme.palette.primary.main} />
                  </Box>
                </Box>

                {/* Contenido de la tarjeta */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Título del producto */}
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.primary"
                    sx={{
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.2,
                      minHeight: '2.4em',
                    }}
                  >
                    {product.title}
                  </Typography>

                  {/* Rating */}
                  <Box sx={{ mb: 2 }}>
                    <Rating
                      value={product.rating}
                      readOnly
                      size="small"
                      sx={{ '& .MuiRating-iconFilled': { color: '#FFD700' } }}
                    />
                  </Box>

                  {/* Precio en puntos y dinero */}
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {product.points.toLocaleString()} puntos + S/{product.price}
                  </Typography>

                  {/* Botón de canjear */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleRedeemPoints(product)}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Canjear Puntos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Mensaje si no hay productos */}
        {filteredProducts.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" mb={2}>
              No se encontraron productos
            </Typography>
            <Typography variant="body1">
              Intenta ajustar los filtros o términos de búsqueda
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StoreContent;
