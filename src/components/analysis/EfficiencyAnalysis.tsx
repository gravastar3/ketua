'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { TrendingUp, Clock, Activity, Zap, BarChart3, PieChartIcon } from 'lucide-react'
import skincareData from '@/data/skincareData.json'

const colors = ['#f4a6c1', '#e8d5f2', '#b8e6f7', '#ffd4e5', '#c8f7e5']

export default function EfficiencyAnalysis() {
  const [selectedMetric, setSelectedMetric] = useState('all')

  const efficiencyData = skincareData.efisiensi.map(item => ({
    ...item,
    jumlahProduk: item['|V|'],
    jumlahKonflik: item['|E|'],
    chromaticNumber: item['χ'],
    waktuKomputasi: item.waktu
  }))

  const getInterpretation = (jenis: string) => {
    const data = efficiencyData.find(d => d.jenis === jenis)
    if (!data) return ''

    const interpretations = {
      'Normal': 'Jenis kulit normal memiliki keseimbangan yang baik antara jumlah produk dan konflik. Dibutuhkan 6 slot waktu untuk mengakomodasi semua produk tanpa konflik.',
      'Berminyak': 'Kulit berminyak memiliki jumlah konflik tertinggi namun dapat dioptimalkan dengan 5 slot waktu. Fokus pada produk kontrol minyak dan anti-jerawat.',
      'Kering': 'Kulit kering memerlukan produk hidrasi lebih banyak, namun jumlah konflik relatif rendah. Dapat diselesaikan dengan 5 slot waktu.',
      'Sensitif': 'Kulit sensitif menggunakan jumlah produk paling sedikit dengan konflik minimal. Hanya membutuhkan 4 slot waktu untuk perawatan yang aman.',
      'Kombinasi': 'Kulit kombinasi memiliki kompleksitas tertinggi dengan produk terbanyak dan konflik terbanyak. Membutuhkan 6 slot waktu untuk penanganan optimal.'
    }
    
    return interpretations[jenis as keyof typeof interpretations] || ''
  }

  const getEfficiencyScore = (data: any) => {
    const produkScore = (data.jumlahProduk / 12) * 100
    const konflikScore = (data.jumlahKonflik / 8) * 100
    const chromaticScore = (data.chromaticNumber / 6) * 100
    const timeScore = (data.waktuKomputasi / 3) * 100
    
    return Math.round(100 - (produkScore + konflikScore + chromaticScore + timeScore) / 4)
  }

  const effectivenessData = efficiencyData.map(item => item.jenis)

  const pieData = efficiencyData.map((item, index) => ({
    name: item.jenis,
    value: item.chromaticNumber,
    color: colors[index % colors.length]
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Analisis Efisiensi Graf
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Semua Metrik</TabsTrigger>
              <TabsTrigger value="comparison">Perbandingan</TabsTrigger>
              <TabsTrigger value="efficiency">Efisiensi</TabsTrigger>
              <TabsTrigger value="interpretation">Interpretasi</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-pink-100 to-pink-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-pink-600" />
                        <span className="text-sm font-medium">Total Produk</span>
                      </div>
                      <p className="text-2xl font-bold text-pink-700">
                        {efficiencyData.reduce((sum, item) => sum + item.jumlahProduk, 0)}
                      </p>
                      <p className="text-xs text-pink-600">Rata-rata: {Math.round(efficiencyData.reduce((sum, item) => sum + item.jumlahProduk, 0) / efficiencyData.length)}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium">Total Konflik</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">
                        {efficiencyData.reduce((sum, item) => sum + item.jumlahKonflik, 0)}
                      </p>
                      <p className="text-xs text-purple-600">Rata-rata: {Math.round(efficiencyData.reduce((sum, item) => sum + item.jumlahKonflik, 0) / efficiencyData.length)}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-blue-100 to-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Chromatic Number</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {Math.max(...efficiencyData.map(item => item.chromaticNumber))}
                      </p>
                      <p className="text-xs text-blue-600">Maksimum slot waktu</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gradient-to-br from-green-100 to-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">Waktu Komputasi</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700">
                        {(efficiencyData.reduce((sum, item) => sum + item.waktuKomputasi, 0) / efficiencyData.length).toFixed(1)}ms
                      </p>
                      <p className="text-xs text-green-600">Rata-rata</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Perbandingan Metrik per Jenis Kulit</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={efficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="jenis" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="jumlahProduk" fill="#f4a6c1" name="Jumlah Produk" />
                      <Bar dataKey="jumlahKonflik" fill="#e8d5f2" name="Jumlah Konflik" />
                      <Bar dataKey="chromaticNumber" fill="#b8e6f7" name="Chromatic Number" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Line Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tren Kompleksitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={efficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="jenis" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="jumlahProduk" stroke="#f4a6c1" strokeWidth={2} name="Produk" />
                        <Line type="monotone" dataKey="jumlahKonflik" stroke="#e8d5f2" strokeWidth={2} name="Konflik" />
                        <Line type="monotone" dataKey="chromaticNumber" stroke="#b8e6f7" strokeWidth={2} name="χ(G)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5" />
                      Distribusi Chromatic Number
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tabel Performa Detail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-2 text-left">Jenis Kulit</th>
                          <th className="border border-gray-200 px-4 py-2 text-center">|V| (Produk)</th>
                          <th className="border border-gray-200 px-4 py-2 text-center">|E| (Konflik)</th>
                          <th className="border border-gray-200 px-4 py-2 text-center">χ (Chromatic)</th>
                          <th className="border border-gray-200 px-4 py-2 text-center">Waktu (ms)</th>
                          <th className="border border-gray-200 px-4 py-2 text-center">Efisiensi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {efficiencyData.map((item, index) => (
                          <motion.tr
                            key={item.jenis}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="border border-gray-200 px-4 py-2 font-medium">
                              <Badge variant="outline" className="bg-gradient-to-r from-pink-100 to-purple-100">
                                {item.jenis}
                              </Badge>
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-center">{item.jumlahProduk}</td>
                            <td className="border border-gray-200 px-4 py-2 text-center">{item.jumlahKonflik}</td>
                            <td className="border border-gray-200 px-4 py-2 text-center">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                {item.chromaticNumber}
                              </Badge>
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-center">{item.waktuKomputasi}</td>
                            <td className="border border-gray-200 px-4 py-2 text-center">
                              <Badge 
                                variant={getEfficiencyScore(item) > 70 ? "default" : "secondary"}
                                className={getEfficiencyScore(item) > 70 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                              >
                                {getEfficiencyScore(item)}%
                              </Badge>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="efficiency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analisis Efisiensi Algoritma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🔍 Kompleksitas Waktu: O(V + E)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Algoritma Greedy Coloring memiliki kompleksitas waktu linear, membuatnya sangat efisien untuk graf berukuran sedang seperti kasus skincare ini.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-white p-3 rounded">
                        <span className="font-medium">V (Vertex):</span> Jumlah produk skincare
                      </div>
                      <div className="bg-white p-3 rounded">
                        <span className="font-medium">E (Edge):</span> Jumlah konflik bahan aktif
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">✨ Keunggulan Implementasi</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• <strong>Waktu eksekusi cepat:</strong> Rata-rata 2.28ms untuk semua jenis kulit</li>
                      <li>• <strong>Memori efisien:</strong> Tidak memerlukan struktur data kompleks</li>
                      <li>• <strong>Hasil konsisten:</strong> Chromatic number optimal untuk kasus ini</li>
                      <li>• <strong>Skalabilitas baik:</strong> Dapat menangani lebih banyak produk</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">⚠️ Batasan Algoritma</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• <strong>Tidak selalu optimal:</strong> Greedy tidak menjamin chromatic number minimum global</li>
                      <li>• <strong>Tergantung urutan:</strong> Hasil dapat berbeda berdasarkan urutan vertex</li>
                      <li>• <strong>Kasus khusus:</strong> Untuk graf sangat kompleks, mungkin perlu algoritma lebih advanced</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interpretation" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {efficiencyData.map((item, index) => (
                  <motion.div
                    key={item.jenis}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: colors[index] }} />
                          {item.jenis}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Produk:</span>
                            <p className="text-lg font-bold text-pink-600">{item.jumlahProduk}</p>
                          </div>
                          <div>
                            <span className="font-medium">Konflik:</span>
                            <p className="text-lg font-bold text-purple-600">{item.jumlahKonflik}</p>
                          </div>
                          <div>
                            <span className="font-medium">Slot:</span>
                            <p className="text-lg font-bold text-blue-600">{item.chromaticNumber}</p>
                          </div>
                          <div>
                            <span className="font-medium">Waktu:</span>
                            <p className="text-lg font-bold text-green-600">{item.waktuKomputasi}ms</p>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <Badge 
                            variant={getEfficiencyScore(item) > 70 ? "default" : "secondary"}
                            className={`w-full justify-center ${
                              getEfficiencyScore(item) > 70 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            Efisiensi: {getEfficiencyScore(item)}%
                          </Badge>
                        </div>

                        <div className="text-xs text-gray-600 leading-relaxed">
                          {getInterpretation(item.jenis)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📊 Kesimpulan Analisis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🎯 Temuan Utama:</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• <strong>Kulit sensitif</strong> memiliki efisiensi tertinggi (produk minimal, konflik minimal)</li>
                      <li>• <strong>Kulit berminyak</strong> memiliki konflik terbanyak namun dapat dioptimalkan dengan baik</li>
                      <li>• <strong>Kulit kombinasi</strong> memerlukan penanganan paling kompleks</li>
                      <li>• <strong>Algoritma Greedy</strong> memberikan hasil optimal untuk semua kasus kulit</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">💡 Rekomendasi:</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Untuk kulit sensitif: Fokus pada produk minimal dengan bahan gentle</li>
                      <li>• Untuk kulit berminyak: Prioritaskan produk kontrol minyak di slot terpisah</li>
                      <li>• Untuk kulit kering: Kelompokkan produk hidrasi dalam slot yang sama</li>
                      <li>• Untuk kulit kombinasi: Gunakan pendekatan zona-based untuk perawatan</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}