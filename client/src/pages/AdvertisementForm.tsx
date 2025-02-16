import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Grid,
  FormHelperText,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { useState, useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { createAdvertisement, getAdvertisement, updateAdvertisement } from '~/services/api'
import type {
  AdvertisementType,
  AutomotiveAdvertisement,
  RealEstateAdvertisement, ServicesAdvertisement
} from '~/types/advertisement'

type FormData = Omit<RealEstateAdvertisement, 'id'> | Omit<AutomotiveAdvertisement, 'id'> | Omit<ServicesAdvertisement, 'id'>;

function AdvertisementForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [step, setStep] = useState(1)

  const { data: existingAd } = useQuery({
    enabled: !!id,
    queryFn: () => getAdvertisement(id!),
    queryKey: ['advertisement', id],
  })

  const { control, handleSubmit, watch, reset, formState } = useForm<FormData>({
    defaultValues: {
      area: 0,
      brand: '',
      cost: 0,
      description: '',
      experience: 0,
      image: '',
      location: '',
      mileage: 0,
      model: '',
      name: '',
      price: 0,
      propertyType: '',
      rooms: 0,
      serviceType: '',
      type: 'Недвижимость' as AdvertisementType,
      workSchedule: '',
      year: 2000,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (existingAd) {
      let defaultValues = {}

      switch (existingAd.type) {
      case 'Авто':
        defaultValues = {
          brand: existingAd.brand || '',
          mileage: existingAd.mileage || '',
          model: existingAd.model || '',
          year: existingAd.year || '',
        }
        break
      case 'Недвижимость':
        defaultValues = {
          area: existingAd.area || '',
          price: existingAd.price || '',
          propertyType: existingAd.propertyType || '',
          rooms: existingAd.rooms || '',
        }
        break
      case 'Услуги':
        defaultValues = {
          cost: existingAd.cost || '',
          experience: existingAd.experience || '',
          serviceType: existingAd.serviceType || '',
          workSchedule: existingAd.workSchedule || '',
        }
        break
      default:
        break
      }

      reset({
        ...existingAd,
        ...defaultValues,
      })
    }
  }, [existingAd, reset])


  const { errors, isValid } = formState

  const watchedFields = watch()

  const createMutation = useMutation({
    mutationFn: createAdvertisement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] })
      navigate('/list')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateAdvertisement(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] })
      navigate('/list')
    },
  })

  const onSubmit = (data: FormData) => {
    if (id) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const selectedType = watch('type')

  const generateRequiredMessage = (label: string) => `${label} is required`

  const fieldLabels = {
    area: 'Area',
    brand: 'Brand',
    cost: 'Cost',
    description: 'Description',
    experience: 'Experience',
    image: 'Image URL',
    location: 'Location',
    model: 'Model',
    name: 'Title',
    price: 'Price',
    propertyType: 'Property Type',
    rooms: 'Number of Rooms',
    serviceType: 'Service Type',
    year: 'Year',
  }

  const generalFieldConfigurations = [
    { label: 'Title', name: 'name', rules: { required: true }, type: 'text' },
    { label: 'Description', name: 'description', rules: { required: true }, type: 'text' },
    { label: 'Location', name: 'location', rules: { required: true }, type: 'text' },
    { label: 'Image URL', name: 'image', rules: { required: false }, type: 'text' },
  ] as const

  const fieldConfigurations = {
    'Авто': [
      { label: 'Brand', name: 'brand', rules: { required: true }, type: 'text' },
      { label: 'Model', name: 'model', rules: { required: true }, type: 'text' },
      { label: 'Year', name: 'year', rules: { max: new Date().getFullYear(), min: 1900, required: true }, type: 'number' },
      { label: 'Mileage (km)', name: 'mileage', rules: {}, type: 'number' },
    ],
    'Недвижимость': [
      { label: 'Property Type', name: 'propertyType', rules: { required: true }, type: 'text' },
      { label: 'Area (m²)', name: 'area', rules: { min: 1, required: true }, type: 'number' },
      { label: 'Number of Rooms', name: 'rooms', rules: { min: 1, required: true }, type: 'number' },
      { label: 'Price (₽)', name: 'price', rules: { min: 1, required: true }, type: 'number' },
    ],
    'Услуги': [
      { label: 'Service Type', name: 'serviceType', rules: { required: true }, type: 'text' },
      { label: 'Experience (years)', name: 'experience', rules: { min: 0, required: true }, type: 'number' },
      { label: 'Cost (₽)', name: 'cost', rules: { min: 1, required: true }, type: 'number' },
      { label: 'Work Schedule', name: 'workSchedule', rules: {}, type: 'text' },
    ],
  } as const

  const renderGeneralFields = () => {
    return generalFieldConfigurations.map(({ name, label, type, rules }) => (
      <Grid item xs={12} key={name}>
        <Controller
          name={name}
          control={control}
          rules={{
            ...rules,
            required: rules.required ? generateRequiredMessage(fieldLabels[name]) : false,
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type={type}
              label={label}
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
    ))
  }

  const renderCategoryFields = () => {
    const fields = fieldConfigurations[selectedType] || []
    return fields.map(({ name, label, type, rules }) => (
      <Grid item xs={12} sm={type === 'number' ? 6 : 12} key={name}>
        <Controller
          name={name}
          control={control}
          rules={{
            ...rules,
            //@ts-ignore
            required: rules.required ? generateRequiredMessage(fieldLabels[name]) : false,
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type={type}
              label={label}
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
    ))
  }

  const handleNextStep = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault() // Prevent form submission
    setStep(2)
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Edit Advertisement' : 'Create Advertisement'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 ? (
          <Grid container spacing={2}>
            {renderGeneralFields()}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select label="Category" {...field}>
                        <MenuItem value="Недвижимость">Real Estate</MenuItem>
                        <MenuItem value="Авто">Automotive</MenuItem>
                        <MenuItem value="Услуги">Services</MenuItem>
                      </Select>
                      {fieldState.error && (
                        <FormHelperText error>{fieldState.error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {renderCategoryFields()}
          </Grid>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          {step === 2 && (
            <Button onClick={() => setStep(1)}>
            Back
            </Button>
          )}
          {step === 1 ? (
            <Button
              variant="contained"
              onClick={handleNextStep}
              disabled={!isValid} // Disable if the form is not valid
            >
            Next
            </Button>
          ) : (
            <Button
              variant="contained"
              type="submit"
              disabled={!isValid || createMutation.isPending || updateMutation.isPending} // Disable if the form is not valid or a mutation is pending
            >
              {id ? 'Update' : 'Create'} Advertisement
            </Button>
          )}
        </Box>
      </form>
    </Paper>
  )
}

export default AdvertisementForm
