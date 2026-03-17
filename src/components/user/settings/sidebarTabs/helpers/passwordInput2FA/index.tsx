import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const PasswordInput = ({
  password,
  setPassword,
}: {
  password: string
  setPassword: (val: string) => void
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full sm:w-2/3">
      <input
        className="w-full rounded-lg px-3 py-2 pr-10 text-white bg-defendrBlack font-poppins"
        placeholder="Enter password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
      >
        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  )
}

export default PasswordInput
