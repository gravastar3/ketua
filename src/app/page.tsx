'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import GraphVisualization from '@/components/graph/GraphVisualization'
import GreedyColoringAlgorithm from '@/components/graph/GreedyColoringAlgorithm'
import SkincareSchedule from '@/components/schedule/SkincareSchedule'
import EfficiencyAnalysis from '@/components/analysis/EfficiencyAnalysis'
import AboutProject from '@/components/about/AboutProject'
import { 
  Home, 
  Network, 
  PlayCircle, 
  Calendar, 
  BarChart3, 
  Info,
  Sparkles,
  Heart,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home')

  const navigationItems = [
    { id: 'home', label: 'Beranda', icon: Home, color: 'from-pink-400 to-purple-400' },
    { id: 'graph', label: 'Visualisasi Graf', icon: Network, color: 'from-purple-400 to-blue-400' },
    { id: 'algorithm', label: 'Algoritma Greedy', icon: PlayCircle, color: 'from-blue-400 to-green-400' },
    { id: 'schedule', label: 'Jadwal Skincare', icon: Calendar, color: 'from-green-400 to-yellow-400' },
    { id: 'analysis', label: 'Analisis Efisiensi', icon: BarChart3, color: 'from-yellow-400 to-orange-400' },
    { id: 'about', label: 'Tentang Proyek', icon: Info, color: 'from-orange-400 to-pink-400' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContent onNavigate={setActiveTab} />
      case 'graph':
        return <GraphVisualization />
      case 'algorithm':
        return <GreedyColoringAlgorithm />
      case 'schedule':
        return <SkincareSchedule />
      case 'analysis':
        return <EfficiencyAnalysis />
      case 'about':
        return <AboutProject />
      default:
        return <HomeContent onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-3"
            >
              <Sparkles className="w-8 h-8 text-pink-500" />
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Skincare Graph Coloring
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`flex items-center gap-2 ${
                    activeTab === item.id 
                      ? `bg-gradient-to-r ${item.color} text-white` 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  {navigationItems.slice(0, 3).map((item) => (
                    <TabsTrigger 
                      key={item.id} 
                      value={item.id}
                      className="text-xs"
                    >
                      <item.icon className="w-3 h-3 mr-1" />
                      {item.label.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                {navigationItems.slice(3).map((item) => (
                  <TabsTrigger 
                    key={item.id} 
                    value={item.id}
                    className="text-xs"
                  >
                    <item.icon className="w-3 h-3 mr-1" />
                    {item.label.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-pink-200 py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-gray-600">
              Proyek Teori Graf 2025 - Universitas Bangka Belitung
            </span>
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <p className="text-xs text-gray-500">
            🌸 Dikembangkan dengan 💜 untuk Gen Z yang peduli perawatan kulit dan matematika terapan
          </p>
        </div>
      </footer>
    </div>
  )
}

function HomeContent({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const features = [
    {
      id: 'graph',
      title: 'Visualisasi Graf Konflik',
      description: 'Lihat hubungan konflik antar produk skincare dalam bentuk graf interaktif',
      icon: Network,
      color: 'from-purple-400 to-blue-400',
      highlights: ['Interaktif', 'Animasi', 'Informasi Detail']
    },
    {
      id: 'algorithm',
      title: 'Algoritma Greedy Coloring',
      description: 'Pahami cara kerja algoritma pewarnaan graf langkah demi langkah',
      icon: PlayCircle,
      color: 'from-blue-400 to-green-400',
      highlights: ['Step-by-Step', 'Visual', 'Educational']
    },
    {
      id: 'schedule',
      title: 'Jadwal Skincare Otomatis',
      description: 'Dapatkan jadwal personal berdasarkan jenis kulit Anda',
      icon: Calendar,
      color: 'from-green-400 to-yellow-400',
      highlights: ['Personal', 'Download', 'Save']
    },
    {
      id: 'analysis',
      title: 'Analisis Efisiensi',
      description: 'Lihat performa algoritma dan interpretasi hasil',
      icon: BarChart3,
      color: 'from-yellow-400 to-orange-400',
      highlights: ['Performa', 'Grafik', 'Insights']
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-6"
        >
          <Sparkles className="w-16 h-16 text-pink-500" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Aplikasi Penerapan Pewarnaan Graf
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-2">
          Merancang Jadwal Penggunaan Produk Skincare
        </p>
        <p className="text-lg text-gray-500 mb-8">
          Berdasarkan Jenis Kulit dengan Algoritma Greedy Coloring
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-sm">
            🧪 Teori Graf
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm">
            💄 Skincare Science
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-sm">
            🤖 Algoritma Greedy
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-sm">
            📅 Optimasi Jadwal
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => onNavigate('graph')}
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3"
          >
            Mulai Eksplorasi
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            onClick={() => onNavigate('about')}
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3"
          >
            Pelajari Teori
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="h-full bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{feature.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight) => (
                    <Badge key={highlight} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>

                <Button 
                  onClick={() => onNavigate(feature.id)}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Jelajahi {feature.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Produk Skincare', value: '10+', color: 'from-pink-400 to-pink-600' },
          { label: 'Jenis Kulit', value: '5', color: 'from-purple-400 to-purple-600' },
          { label: 'Konflik Teridentifikasi', value: '6', color: 'from-blue-400 to-blue-600' },
          { label: 'Slot Waktu Optimal', value: '4-6', color: 'from-green-400 to-green-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-r ${stat.color} text-white border-0`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center py-8">
        <Card className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 border-pink-300">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">
              Siap Memulai Perjalanan Skincare Optimal Anda?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Jelajahi visualisasi graf, pahami algoritma pewarnaan, dan dapatkan jadwal skincare 
              personal yang disesuaikan dengan jenis kulit dan kebutuhan Anda.
            </p>
            <Button 
              onClick={() => onNavigate('schedule')}
              className="bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3"
            >
              Buat Jadwal Saya Sekarang
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}