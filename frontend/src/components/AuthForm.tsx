import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

type AuthFormProps = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthForm({ open, onClose, onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, signup } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    let success = false

    if (mode === 'login') {
      success = login(username, password)
      if (!success) {
        setError('Invalid username or password')
        return
      }
    } else {
      success = signup(username, password)
      if (!success) {
        setError('Username already taken')
        return
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (success) {
      onSuccess()
      setUsername('')
      setPassword('')
    }
  }

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: 'login' | 'signup',
  ) => {
    setMode(newValue)
    setError('')
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Tabs value={mode} onChange={handleTabChange} centered>
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
