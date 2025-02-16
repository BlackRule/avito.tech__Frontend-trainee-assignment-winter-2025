import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdvertisement, deleteAdvertisement } from '~/services/api'
import type { Advertisement } from '~/types/advertisement'

function AdvertisementDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: ad, isLoading, isError } = useQuery({
    enabled: !!id,
    queryFn: () => getAdvertisement(id!),
    queryKey: ['advertisement', id],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAdvertisement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] })
      navigate('/list')
    },
  })

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (isError || !ad) {
    return <Typography color="error">Advertisement not found</Typography>
  }

  const renderCategorySpecificDetails = (ad: Advertisement) => {
    switch (ad.type) {
    case 'Недвижимость':
      return (
        <>
          <Typography>
            <strong>Property Type:</strong> {ad.propertyType}
          </Typography>
          <Typography>
            <strong>Area:</strong> {ad.area} m²
          </Typography>
          <Typography>
            <strong>Rooms:</strong> {ad.rooms}
          </Typography>
          <Typography>
            <strong>Price:</strong> {ad.price} ₽
          </Typography>
        </>
      )

    case 'Авто':
      return (
        <>
          <Typography>
            <strong>Brand:</strong> {ad.brand}
          </Typography>
          <Typography>
            <strong>Model:</strong> {ad.model}
          </Typography>
          <Typography>
            <strong>Year:</strong> {ad.year}
          </Typography>
          {ad.mileage && (
            <Typography>
              <strong>Mileage:</strong> {ad.mileage} km
            </Typography>
          )}
        </>
      )

    case 'Услуги':
      return (
        <>
          <Typography>
            <strong>Service Type:</strong> {ad.serviceType}
          </Typography>
          <Typography>
            <strong>Experience:</strong> {ad.experience} years
          </Typography>
          <Typography>
            <strong>Cost:</strong> {ad.cost} ₽
          </Typography>
          {ad.workSchedule && (
            <Typography>
              <strong>Work Schedule:</strong> {ad.workSchedule}
            </Typography>
          )}
        </>
      )
    }
  }

  return (
    <>
      <Card>
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="400"
              image={ad.image || '/placeholder.png'}
              alt={ad.name}
              sx={{ objectFit: 'cover' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {ad.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {ad.location}
              </Typography>
              <Typography variant="body1" paragraph>
                {ad.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {renderCategorySpecificDetails(ad)}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button variant="contained" onClick={() => navigate(`/form/${ad.id}`)}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)}>
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Advertisement</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this advertisement?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => deleteMutation.mutate(id!)} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AdvertisementDetails