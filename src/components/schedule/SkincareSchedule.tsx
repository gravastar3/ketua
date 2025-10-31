'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, Clock, Save, RotateCcw, Download, Heart } from 'lucide-react'
import skincareData from '@/data/skincareData.json'

interface ScheduleData {
  [key: string]: {
    pagi: string[]
    malam: string[]
  }
}

interface SavedSchedule {
  skinType: string
  schedule: ScheduleData
  savedAt: string
}

export default function SkincareSchedule() {
  const [selectedSkinType, setSelectedSkinType] = useState('normal')
  const [savedSchedule, setSavedSchedule] = useState<SavedSchedule | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const skinTypes = [
    { id: 'normal', name: 'Normal', icon: '😊', color: 'pastel-pink' },
    { id: 'berminyak', name: 'Berminyak', icon: '🫧', color: 'pastel-purple' },
    { id: 'kering', name: 'Kering', icon: '🌵', color: 'pastel-blue' },
    { id: 'sensitif', name: 'Sensitif', icon: '🌸', color: 'pastel-mint' },
    { id: 'kombinasi', name: 'Kombinasi', icon: '⚖️', color: 'pastel-peach' }
  ]

  const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']
  const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

  useEffect(() => {
    loadSavedSchedule()
  }, [])

  const loadSavedSchedule = () => {
    const saved = localStorage.getItem('skincareSchedule')
    if (saved) {
      const parsed = JSON.parse(saved)
      setSavedSchedule(parsed)
      if (parsed.skinType === selectedSkinType) {
        setIsSaved(true)
      }
    }
  }

  const saveSchedule = () => {
    const scheduleToSave: SavedSchedule = {
      skinType: selectedSkinType,
      schedule: skincareData.jadwal[selectedSkinType as keyof typeof skincareData.jadwal] as ScheduleData,
      savedAt: new Date().toISOString()
    }
    
    localStorage.setItem('skincareSchedule', JSON.stringify(scheduleToSave))
    setSavedSchedule(scheduleToSave)
    setIsSaved(true)
  }

  const resetSchedule = () => {
    localStorage.removeItem('skincareSchedule')
    setSavedSchedule(null)
    setIsSaved(false)
  }

  const downloadSchedule = () => {
    const schedule = skincareData.jadwal[selectedSkinType as keyof typeof skincareData.jadwal] as ScheduleData
    const scheduleText = generateScheduleText(schedule)
    
    const blob = new Blob([scheduleText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skincare-schedule-${selectedSkinType}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateScheduleText = (schedule: ScheduleData) => {
    let text = `JADWAL SKINCARE - KULIT ${selectedSkinType.toUpperCase()}\n`
    text += '=' .repeat(50) + '\n\n'
    
    days.forEach((day, index) => {
      text += `${dayNames[index].toUpperCase()}\n`
      text += '-'.repeat(20) + '\n'
      text += `Pagi: ${schedule[day].pagi.join(', ')}\n`
      text += `Malam: ${schedule[day].malam.join(', ')}\n\n`
    })
    
    text += '\nCatatan:\n'
    text += '- Ikuti jadwal secara konsisten untuk hasil terbaik\n'
    text += '- Sesuaikan dengan kondisi kulit Anda\n'
    text += '- Konsultasikan dengan dokter kulit jika perlu\n'
    
    return text
  }

  const getProductIcon = (productName: string) => {
    const icons: { [key: string]: string } = {
      'Cleanser': '🧴',
      'Toner': '💧',
      'Vitamin C': '🍊',
      'Niacinamide': '✨',
      'Retinol': '🌙',
      'AHA/BHA': '🧪',
      'Moisturizer': '🌿',
      'Sunscreen': '☀️',
      'Clay Mask': '🏔️',
      'Hydrating Mask': '💦'
    }
    return icons[productName] || '🧴'
  }

  const getProductInfo = (productName: string) => {
    return skincareData.produk.find(p => p.nama === productName)
  }

  const currentSchedule = skincareData.jadwal[selectedSkinType as keyof typeof skincareData.jadwal] as ScheduleData
  const displaySchedule = savedSchedule?.skinType === selectedSkinType ? savedSchedule.schedule : currentSchedule

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="w-6 h-6 text-pink-500" />
            Jadwal Skincare Otomatis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Skin Type Selector */}
          <div className="mb-6">
            <Tabs value={selectedSkinType} onValueChange={setSelectedSkinType} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                {skinTypes.map((type) => (
                  <TabsTrigger 
                    key={type.id} 
                    value={type.id}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white"
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {skinTypes.map((type) => (
                <TabsContent key={type.id} value={type.id} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                  >
                    <div className={`inline-block p-4 rounded-full ${type.color} mb-4`}>
                      <span className="text-3xl">{type.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Perawatan untuk Kulit {type.name}</h3>
                    <p className="text-gray-600">
                      {type.id === 'normal' && 'Jadwal seimbang untuk menjaga kesehatan kulit normal'}
                      {type.id === 'berminyak' && 'Fokus pada kontrol minyak dan pencegahan jerawat'}
                      {type.id === 'kering' && 'Intensif hidrasi dan perlindungan barrier kulit'}
                      {type.id === 'sensitif' && 'Perawatan gentle dengan bahan yang menenangkan'}
                      {type.id === 'kombinasi' && 'Penanganan zona T berminyak dan area kering'}
                    </p>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              onClick={saveSchedule}
              disabled={isSaved}
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaved ? 'Tersimpan' : 'Simpan Jadwal Saya'}
            </Button>
            <Button 
              onClick={downloadSchedule}
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Jadwal
            </Button>
            <Button 
              onClick={resetSchedule}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Jadwal
            </Button>
            {savedSchedule && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Heart className="w-3 h-3 mr-1" />
                Tersimpan: {new Date(savedSchedule.savedAt).toLocaleDateString('id-ID')}
              </Badge>
            )}
          </div>

          {/* Schedule Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Jadwal Mingguan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Hari</TableHead>
                      <TableHead className="w-48">Pagi</TableHead>
                      <TableHead className="w-48">Malam</TableHead>
                      <TableHead>Catatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {days.map((day, index) => (
                      <motion.tr
                        key={day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {['🌅', '🌤️', '🌧️', '⛅', '🌞', '🌅', '🌙'][index]}
                            </span>
                            {dayNames[index]}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {displaySchedule[day].pagi.map((product, productIndex) => {
                              const productInfo = getProductInfo(product)
                              return (
                                <motion.div
                                  key={product}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 + productIndex * 0.05 }}
                                  className="flex items-center gap-2 p-2 bg-pink-50 rounded-lg"
                                >
                                  <span className="text-lg">{getProductIcon(product)}</span>
                                  <div>
                                    <div className="font-medium text-sm">{product}</div>
                                    {productInfo && (
                                      <div className="text-xs text-gray-500">
                                        {productInfo.fungsi}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {displaySchedule[day].malam.map((product, productIndex) => {
                              const productInfo = getProductInfo(product)
                              return (
                                <motion.div
                                  key={product}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 + productIndex * 0.05 }}
                                  className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg"
                                >
                                  <span className="text-lg">{getProductIcon(product)}</span>
                                  <div>
                                    <div className="font-medium text-sm">{product}</div>
                                    {productInfo && (
                                      <div className="text-xs text-gray-500">
                                        {productInfo.fungsi}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-600">
                            {displaySchedule[day].pagi.includes('Sunscreen') && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 mb-1">
                                ☀️ Wajib SPF
                              </Badge>
                            )}
                            {displaySchedule[day].malam.includes('Retinol') && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 mb-1">
                                🌙 Night Treatment
                              </Badge>
                            )}
                            {displaySchedule[day].pagi.some(p => p.includes('Mask')) || 
                             displaySchedule[day].malam.some(p => p.includes('Mask')) ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 mb-1">
                                💆 Mask Day
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">💡 Tips Penggunaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-pink-700">Pagi Hari</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Mulai dengan pembersihan lembut</li>
                    <li>• Gunakan toner untuk keseimbangan pH</li>
                    <li>• Aplikasikan serum sesuai kebutuhan</li>
                    <li>• Jangan lupa moisturizer dan sunscreen</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-purple-700">Malam Hari</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Double cleansing untuk makeup</li>
                    <li>• Gunakan treatment produk</li>
                    <li>• Aplikasikan moisturizer</li>
                    <li>• Hindari over-exfoliation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}