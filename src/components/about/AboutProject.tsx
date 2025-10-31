'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Award, Target, Lightbulb, Code, Calculator, GitBranch, User, Mail, Camera } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  nim: string
  photo: string
  email?: string
}

export default function AboutProject() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { 
      id: '1', 
      name: 'Isma Aulia', 
      role: 'Ketua Kelompok', 
      nim: '1072311008',
      photo: '/images/anggota/anggota1.jpg'
    },
    { 
      id: '2', 
      name: 'Liya Amanda', 
      role: 'Anggota', 
      nim: '1072311011',
      photo: '/images/anggota/anggota2.jpg'
    },
    { 
      id: '3', 
      name: 'Mutia Ramadhani', 
      role: 'Anggota', 
      nim: '1072311012',
      photo: '/images/anggota/anggota3.jpg'
    },
    { 
      id: '4', 
      name: 'Alzamara Aderta', 
      role: 'Anggota', 
      nim: '1072311027',
      photo: '/images/anggota/anggota4.jpg'
    }
  ])

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleImageError = (memberId: string) => {
    setImageErrors(prev => new Set([...prev, memberId]))
  }

  const getMemberPhoto = (member: TeamMember) => {
    if (imageErrors.has(member.id)) {
      return '/images/default-avatar.svg'
    }
    return member.photo
  }

  const getRoleColor = (role: string) => {
    const roleColors: { [key: string]: string } = {
      'Ketua Kelompok': 'from-pink-400 to-purple-400',
      'Analis Data': 'from-purple-400 to-blue-400',
      'Programmer': 'from-blue-400 to-green-400',
      'Editor & UI/UX': 'from-green-400 to-yellow-400'
    }
    return roleColors[role] || 'from-gray-400 to-gray-600'
  }

  const getRoleIcon = (role: string) => {
    const roleIcons: { [key: string]: React.ReactNode } = {
      'Ketua Kelompok': <Award className="w-4 h-4" />,
      'Analis Data': <Calculator className="w-4 h-4" />,
      'Programmer': <Code className="w-4 h-4" />,
      'Editor & UI/UX': <Target className="w-4 h-4" />
    }
    return roleIcons[role] || <User className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <BookOpen className="w-16 h-16 text-purple-500" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Tentang Proyek Teori Graf
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Aplikasi Penerapan Pewarnaan Graf dalam Merancang Jadwal Skincare
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              onClick={() => scrollToSection('teori')}
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Teori Dasar
            </Button>
            <Button 
              onClick={() => scrollToSection('algoritma')}
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Code className="w-4 h-4 mr-2" />
              Algoritma
            </Button>
            <Button 
              onClick={() => scrollToSection('tim')}
              variant="outline"
              className="border-green-300 text-green-600 hover:bg-green-50"
            >
              <Users className="w-4 h-4 mr-2" />
              Tim Kami
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        {/* Project Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-purple-600">
                🎯 Tujuan Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Proyek ini bertujuan untuk mengimplementasikan konsep <strong>pewarnaan graf (graph coloring)</strong> 
                dalam konteks praktis yaitu penyusunan jadwal penggunaan produk skincare. Melalui algoritma <strong>Greedy Coloring</strong>, 
                kami mengoptimalkan penggunaan produk agar tidak terjadi konflik bahan aktif yang dapat merusak kulit.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  🧪 Matematika Terapan
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  💄 Skincare Science
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  🤖 Algoritma & Pemrograman
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  📱 Web Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Theory Section */}
        <section id="teori" className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calculator className="w-6 h-6 text-purple-500" />
                  Teori Dasar Pewarnaan Graf
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-purple-700">
                      📊 Definisi Graf Konflik
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p>
                        <strong>Graf G = (V, E)</strong> dimana:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>V (Vertex):</strong> Himpunan produk skincare</li>
                        <li><strong>E (Edge):</strong> Hubungan konflik antar produk</li>
                        <li><strong>Konflik:</strong> Dua produk tidak boleh digunakan bersamaan</li>
                      </ul>
                      <div className="bg-white p-3 rounded mt-3">
                        <p className="font-mono text-xs">
                          Contoh: Vitamin C -- Retinol (konflik tinggi)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">
                      🎨 Pewarnaan Graf
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p>
                        <strong>Pewarnaan proper:</strong> Penugasan warna pada vertex sehingga tidak ada dua vertex bertetangga yang memiliki warna sama.
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Chromatic Number (χ):</strong> Minimum warna yang dibutuhkan</li>
                        <li><strong>Slot Waktu:</strong> Setiap warna merepresentasikan waktu penggunaan</li>
                        <li><strong>Optimalisasi:</strong> Minimalkan jumlah slot waktu</li>
                      </ul>
                      <div className="bg-white p-3 rounded mt-3">
                        <p className="font-mono text-xs">
                          χ(G) = minimum slot waktu untuk skincare
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-orange-700">
                    ⚡ Algoritma Greedy Coloring
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Langkah-langkah:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                        <li>Urutkan vertex berdasarkan derajat tertinggi</li>
                        <li>Untuk setiap vertex, cari warna terkecil yang tersedia</li>
                        <li>Warna tersedia jika tidak ada tetangga yang menggunakannya</li>
                        <li>Lanjutkan hingga semua vertex diwarnai</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Kompleksitas:</h4>
                      <div className="bg-white p-3 rounded text-sm">
                        <p className="font-mono mb-2">Waktu: O(V + E)</p>
                        <p className="font-mono mb-2">Space: O(V)</p>
                        <p className="text-gray-600 text-xs">
                          Sangat efisien untuk graf berukuran sedang
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Algorithm Section */}
        <section id="algoritma" className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Code className="w-6 h-6 text-blue-500" />
                  Implementasi Algoritma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <GitBranch className="w-8 h-8 text-blue-500 mb-2" />
                    <h4 className="font-semibold mb-2">Struktur Data</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Adjacency List untuk graf</li>
                      <li>• Array untuk warna vertex</li>
                      <li>• JSON untuk data produk</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Target className="w-8 h-8 text-purple-500 mb-2" />
                    <h4 className="font-semibold mb-2">Optimasi</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Sorting berdasarkan derajat</li>
                      <li>• Early termination</li>
                      <li>• Memory efficient</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Lightbulb className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="font-semibold mb-2">Fitur Tambahan</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Visualisasi interaktif</li>
                      <li>• Animasi langkah demi langkah</li>
                      <li>• Analisis performa</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Team Section */}
        <section id="tim" className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="w-6 h-6 text-green-500" />
                  Tim Pengembang
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-4">
                    Proyek ini dikembangkan oleh 4 mahasiswa mata kuliah Teori Graf
                  </p>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg inline-block">
                    <p className="font-semibold text-green-700">
                      🎓 Dosen Pembimbing: Elyas Kustiawan, S.Si., M.Si.
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Fakultas Sains dan Teknik - Universitas Banfka Belitung
                    </p>
                  </div>
                </div>

                {/* Grid 2x2 untuk 4 anggota */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className="w-full"
                    >
                      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 h-full">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center">
                            {/* Photo Section */}
                            <div className="relative mb-4">
                              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-pink-200 to-purple-200">
                                <img
                                  src={getMemberPhoto(member)}
                                  alt={member.name}
                                  onError={() => handleImageError(member.id)}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {imageErrors.has(member.id) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Camera className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Member Info */}
                            <h3 className="font-bold text-lg text-gray-800 mb-1">
                              {member.name}
                            </h3>
                            
                            <div className="flex items-center justify-center gap-1 mb-2">
                              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRoleColor(member.role)} text-white text-xs font-medium flex items-center gap-1`}>
                                {getRoleIcon(member.role)}
                                {member.role}
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-1 font-mono">
                              {member.nim}
                            </p>

                            {member.email && (
                              <div className="flex items-center justify-center text-xs text-gray-500">
                                <Mail className="w-3 h-3 mr-1" />
                                {member.email}
                              </div>
                            )}

                            {/* Photo Status */}
                            <div className="mt-3">
                              {imageErrors.has(member.id) ? (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                                  📷 Foto belum tersedia
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                  ✅ Foto tersedia
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">🏆 Kontribusi Tim</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                      Algoritma & Logika
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Frontend Development
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      UI/UX Design
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Data Analysis
                    </Badge>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      Documentation
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-12"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-orange-600">
                🛠️ Teknologi yang Digunakan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">Frontend</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Next.js 15</li>
                    <li>• TypeScript</li>
                    <li>• TailwindCSS</li>
                    <li>• shadcn/ui</li>
                  </ul>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-2">Visualisasi</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Vis Network</li>
                    <li>• Framer Motion</li>
                    <li>• Recharts</li>
                    <li>• Lucide Icons</li>
                  </ul>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <h4 className="font-semibold text-green-700 mb-2">Data</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• JSON</li>
                    <li>• LocalStorage</li>
                    <li>• Adjacency Matrix</li>
                    <li>• Graph Theory</li>
                  </ul>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                  <h4 className="font-semibold text-pink-700 mb-2">Design</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Pastel Colors</li>
                    <li>• Responsive Design</li>
                    <li>• Modern UI</li>
                    <li>• Gen Z Aesthetic</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-pink-200 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Proyek Teori Graf 2025
          </h3>
          <p className="text-gray-600 mb-4">
            Universitas Bangka Belitung - Fakultas sains dan teknik
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>🌸 Dikembangkan dengan 💜</span>
            <span>🧪 Matematika Terapan</span>
            <span>💄 Skincare Science</span>
            <span>🤖 Modern Web Tech</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            © 2025 Tim Teori Graf.
          </p>
        </div>
      </footer>
    </div>
  )
}