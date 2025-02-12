import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdvertisements } from '~/services/api'
import type { Advertisement, AdvertisementType } from '~/types/advertisement'

const ITEMS_PER_PAGE = 5

function AdvertisementList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<AdvertisementType | 'all'>('all')
  const [page, setPage] = useState(1)

  const { data: advertisements = [], isLoading } = useQuery({
    queryFn: getAdvertisements,
    queryKey: ['advertisements'],
  })

  const filteredAds = advertisements.filter((ad) => {
    const matchesSearch = ad.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || ad.type === category
    return matchesSearch && matchesCategory
  })

  const paginatedAds = filteredAds.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const pageCount = Math.ceil(filteredAds.length / ITEMS_PER_PAGE)

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value as AdvertisementType | 'all')}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Недвижимость">Real Estate</MenuItem>
                <MenuItem value="Авто">Automotive</MenuItem>
                <MenuItem value="Услуги">Services</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        {paginatedAds.map((ad) => (
          <Grid item xs={12} key={ad.id}>
            <Card>
              <Grid container>
                <Grid item xs={12} sm={4}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={ad.image || '/placeholder.png'}
                    alt={ad.name}
                    sx={{ objectFit: 'cover' }}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {ad.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {ad.location}
                    </Typography>
                    <Typography color="text.secondary">
                      Category: {ad.type}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/item/${ad.id}`)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}
    </Box>
  )
}

export default AdvertisementList