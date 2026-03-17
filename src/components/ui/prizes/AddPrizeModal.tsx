'use client'

import { useState } from 'react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import FormSelect from '@/components/ui/FormSelect'
import FormInput from '@/components/ui/FormInput'
import { PrizeType } from '@/types/prizeType'

interface PrizeData {
  rank: number
  type: PrizeType
  value: number
  currency?: string
  customName?: string
  voucherPlatform?: string
  voucherCode?: string
}

interface AddPrizeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (prizeData: PrizeData) => void
}

export default function AddPrizeModal({ isOpen, onClose, onAdd }: AddPrizeModalProps) {
  const [rank, setRank] = useState('')
  const [type, setType] = useState('')
  const [prizeValue, setPrizeValue] = useState('')
  const [currency, setCurrency] = useState('')
  const [cashPrize, setCashPrize] = useState('')
  const [customName, setCustomName] = useState('')
  const [voucherPlatform, setVoucherPlatform] = useState('')
  const [voucherCode, setVoucherCode] = useState('')
  const [error, setError] = useState('')

  const rankOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
  ]

  const typeOptions = [
    { value: 'RED_POINTS', label: 'Red Coins' },
    { value: 'CASH', label: 'Cash' },
    { value: 'VOUCHER', label: 'Voucher' },
    { value: 'OTHER', label: 'Custom Prize' },
  ]

  const currencyOptions = [
    { value: 'TND', label: 'TND' },
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD' },
  ]

  const handleSubmit = () => {
    if (!rank) {
      setError('Please select a rank')
      return
    }

    if (!type) {
      setError('Please select a reward type')
      return
    }

    let value = 0
    let selectedCurrency = ''
    let selectedCustomName = ''

    if (type === 'RED_POINTS') {
      if (!prizeValue || isNaN(parseFloat(prizeValue)) || parseFloat(prizeValue) <= 0) {
        setError('Please enter a valid prize value')
        return
      }
      value = parseFloat(prizeValue)
    } else if (type === 'CASH') {
      if (!currency) {
        setError('Please select a currency')
        return
      }
      if (!cashPrize || isNaN(parseFloat(cashPrize)) || parseFloat(cashPrize) <= 0) {
        setError('Please enter a valid cash prize amount')
        return
      }
      value = parseFloat(cashPrize)
      selectedCurrency = currency
    } else if (type === 'VOUCHER') {
      if (!voucherPlatform.trim()) {
        setError('Please enter a voucher platform')
        return
      }
      if (!voucherCode.trim()) {
        setError('Please enter a voucher code')
        return
      }
      value = 1
    } else if (type === 'OTHER') {
      if (!customName.trim()) {
        setError('Please enter a custom prize name')
        return
      }
      selectedCustomName = customName.trim()
      value = 1
    }

    onAdd({
      rank: parseInt(rank),
      type: type as PrizeType,
      value: value,
      currency: selectedCurrency,
      customName: selectedCustomName,
      voucherPlatform: voucherPlatform.trim() || undefined,
      voucherCode: voucherCode.trim() || undefined,
    })

    handleClose()
  }

  const handleClose = () => {
    setRank('')
    setType('')
    setPrizeValue('')
    setCurrency('')
    setCashPrize('')
    setCustomName('')
    setVoucherPlatform('')
    setVoucherCode('')
    setError('')
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-defendrLightBlack rounded-lg p-6 w-[500px]">
        <div className="mb-6">
          <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4">
            Add Prize
          </Typo>
        </div>

        <div className="space-y-4">
          {/* Rank Selection */}
          <FormSelect
            label="Rank"
            options={rankOptions}
            placeholder="Select rank"
            value={rank}
            onChange={setRank}
          />

          {/* Reward Section */}
          <div>
            <Typo as="h4" className="mb-3" color="white" fontFamily="poppins" fontVariant="p2">
              Reward
            </Typo>

            {/* Type Selection */}
            <FormSelect
              className="mb-4"
              label="Type"
              options={typeOptions}
              placeholder="Select type"
              value={type}
              onChange={setType}
            />

            {/* Conditional Fields Based on Type */}
            {type === 'RED_POINTS' && (
              <FormInput
                label="Prize Value"
                placeholder="Enter prize value"
                value={prizeValue}
                onChange={setPrizeValue}
              />
            )}

            {type === 'CASH' && (
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Currency"
                  options={currencyOptions}
                  placeholder="Select currency"
                  value={currency}
                  onChange={setCurrency}
                />
                <FormInput
                  label="Cash Prize"
                  placeholder="Enter amount"
                  value={cashPrize}
                  onChange={setCashPrize}
                />
              </div>
            )}

            {type === 'VOUCHER' && (
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Platform"
                  placeholder="e.g., Steam, Epic Games"
                  value={voucherPlatform}
                  onChange={setVoucherPlatform}
                />
                <FormInput
                  label="Voucher Code"
                  placeholder="Enter voucher code"
                  value={voucherCode}
                  onChange={setVoucherCode}
                />
              </div>
            )}

            {type === 'OTHER' && (
              <FormInput
                label="Custom Prize Name"
                placeholder="Enter custom prize name"
                value={customName}
                onChange={setCustomName}
              />
            )}
          </div>

          {error && (
            <Typo as="p" className="mt-2" color="red" fontFamily="poppins" fontVariant="p5">
              {error}
            </Typo>
          )}
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <Button
            label="Cancel"
            size="xxs"
            textClassName="font-poppins"
            variant="outlined-grey"
            onClick={handleClose}
          />
          <Button
            label="Save"
            size="xxs"
            textClassName="font-poppins"
            variant="contained-red"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
