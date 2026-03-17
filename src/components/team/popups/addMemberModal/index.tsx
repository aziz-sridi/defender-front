'use client'
import { useEffect, useState } from 'react'

import SelectRole from '@/components/team/popups/selectRole'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import { getAllUsers } from '@/services/userService'

interface NewMember {
  name: string
  userId: string
  role: string
  message: string
}

interface AddMemberModalProps {
  newMember: NewMember
  setNewMember: (member: NewMember) => void
  onSave: () => void
  onCancel: () => void
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  newMember,
  setNewMember,
  onSave,
  onCancel,
}) => {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredUsers([])
    } else {
      setFilteredUsers(
        users.filter(user =>
          (user.nickname || user.fullname || '').toLowerCase().startsWith(search.toLowerCase()),
        ),
      )
    }
  }, [search, users])

  const handleSelectUser = (user: any) => {
    setNewMember({
      ...newMember,
      userId: user._id,
      name: user.nickname || user.fullname || '',
    })
    setSearch(user.nickname || user.fullname || '')
    setShowSuggestions(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#212529] rounded-xl p-6 sm:p-8 w-full max-w-md mx-4">
        <Typo
          className="text-lg sm:text-2xl mb-4 font-medium"
          fontFamily="poppins"
          fontVariant="p1"
        >
          Invite New Member
        </Typo>

        <div className="mb-6 relative">
          <Typo
            className="text-gray-400 text-sm mb-4 font-poppins"
            fontFamily="poppins"
            fontVariant="p1"
          >
            Send an invitation to join your team.
          </Typo>
          <Typo
            className="block text-white text-sm mb-2 font-poppins"
            fontFamily="poppins"
            fontVariant="p1"
          >
            Search User
          </Typo>
          <Input
            className="w-full bg-[#312f31] border border-gray-600 rounded-lg p-4 text-white font-poppins focus:border-[#D62755] focus:ring-2 focus:ring-[#D62755]/20 transition-all duration-200"
            placeholder="Type a name..."
            value={search}
            onChange={(value: string) => {
              setSearch(value)
              setShowSuggestions(true)
            }}
          />
          {showSuggestions && search.trim() !== '' && (
            <ul className="absolute w-full bg-[#312f31] border border-gray-600 mt-2 rounded-xl shadow-lg max-h-40 overflow-y-auto z-10">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <li
                    key={user._id}
                    className="px-4 py-3 hover:bg-[#444] cursor-pointer text-white font-poppins border-b border-gray-700 last:border-b-0 transition-colors duration-150"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex flex-col">
                      <Typo className="font-medium text-white" fontFamily="poppins">
                        {user.nickname || 'No username'}
                      </Typo>
                      {user.fullname && user.fullname !== user.nickname && (
                        <Typo className="text-sm text-gray-400" fontFamily="poppins">
                          {user.fullname}
                        </Typo>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-center">
                  <Typo className="text-gray-400" fontFamily="poppins">
                    No users found. Try a different name.
                  </Typo>
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="mb-6">
          <Typo className="block text-white text-sm mb-2 font-medium" fontFamily="poppins">
            Role
          </Typo>
          <div className="relative">
            <SelectRole
              className="w-full bg-[#312f31] border border-gray-600 rounded-lg p-3 text-white appearance-none pr-8 font-poppins focus:border-[#D62755] focus:ring-2 focus:ring-[#D62755]/20 transition-all duration-200"
              value={newMember.role}
              onChange={e => setNewMember({ ...newMember, role: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-6">
          <Typo className="block text-white text-sm mb-2 font-medium" fontFamily="poppins">
            Personal Message (Optional)
          </Typo>
          <textarea
            className="w-full bg-[#312f31] border border-gray-600 rounded-xl p-3 text-white resize-none font-poppins focus:border-[#D62755] focus:ring-2 focus:ring-[#D62755]/20 transition-all duration-200"
            placeholder="We'd like you to join our organization..."
            rows={3}
            value={newMember.message}
            onChange={e => setNewMember({ ...newMember, message: e.target.value })}
          />
        </div>

        <div className="flex justify-center gap-4 mt-auto font-poppins">
          <Button
            className="btn-defendr-grey w-auto"
            label="Cancel"
            size="xxs"
            textClassName="sm:text-sm text-xs"
            variant="outlined-grey"
            onClick={onCancel}
          />
          <Button
            className="btn-defendr-red w-auto"
            label="Send Invitation"
            size="s"
            textClassName="sm:text-sm text-xs"
            variant="contained-red"
            onClick={onSave}
          />
        </div>
      </div>
    </div>
  )
}

export default AddMemberModal
