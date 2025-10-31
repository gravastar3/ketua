'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, SkipForward, RotateCcw, ChevronRight, Sparkles } from 'lucide-react'
import skincareData from '@/data/skincareData.json'

interface ColoringStep {
  vertex: string
  color: string
  colorIndex: number
  availableColors: number[]
  neighbors: string[]
  reason: string
}

export default function GreedyColoringAlgorithm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [steps, setSteps] = useState<ColoringStep[]>([])
  const [coloredVertices, setColoredVertices] = useState<Map<string, number>>(new Map())
  const [highlightedVertex, setHighlightedVertex] = useState<string | null>(null)

  const colors = [
    '#f4a6c1', '#e8d5f2', '#b8e6f7', '#ffd4e5', '#c8f7e5', '#f5d0a9'
  ]

  const colorNames = [
    'Soft Pink', 'Lavender', 'Baby Blue', 'Peach', 'Mint', 'Coral'
  ]

  useEffect(() => {
    generateColoringSteps()
  }, [])

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 2000)
      return () => clearTimeout(timer)
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, steps.length])

  const generateColoringSteps = () => {
    const sortedVertices = getSortedVertices()
    const colored = new Map<string, number>()
    const algorithmSteps: ColoringStep[] = []

    sortedVertices.forEach((vertex, vertexIndex) => {
      const neighbors = getNeighbors(vertex)
      const availableColors = getAvailableColors(vertex, colored)
      const selectedColor = availableColors[0]
      
      colored.set(vertex, selectedColor)
      
      algorithmSteps.push({
        vertex,
        color: colors[selectedColor],
        colorIndex: selectedColor,
        availableColors,
        neighbors,
        reason: generateReason(vertex, selectedColor, availableColors, neighbors, colored)
      })
    })

    setSteps(algorithmSteps)
  }

  const getSortedVertices = () => {
    return [...skincareData.graf.vertices].sort((a, b) => getDegree(b) - getDegree(a))
  }

  const getDegree = (vertex: string) => {
    return skincareData.graf.edges.filter(
      edge => edge[0] === vertex || edge[1] === vertex
    ).length
  }

  const getNeighbors = (vertex: string) => {
    return skincareData.graf.edges
      .filter(edge => edge[0] === vertex || edge[1] === vertex)
      .map(edge => edge[0] === vertex ? edge[1] : edge[0])
  }

  const getAvailableColors = (vertex: string, colored: Map<string, number>) => {
    const neighbors = getNeighbors(vertex)
    const usedColors = neighbors
      .map(neighbor => colored.get(neighbor))
      .filter((color): color is number => color !== undefined)

    return colors
      .map((_, index) => index)
      .filter(colorIndex => !usedColors.includes(colorIndex))
  }

  const generateReason = (
    vertex: string, 
    selectedColor: number, 
    availableColors: number[], 
    neighbors: string[], 
    colored: Map<string, number>
  ) => {
    const neighborColors = neighbors
      .map(neighbor => `${neighbor} (warna ${colored.get(neighbor) !== undefined ? colorNames[colored.get(neighbor)!] : 'belum diwarnai'})`)
      .join(', ')

    if (availableColors.length === colors.length) {
      return `${vertex} tidak memiliki tetangga yang diwarnai, sehingga warna pertama (${colorNames[selectedColor]}) dapat digunakan.`
    }

    const conflictingColors = colors
      .map((_, index) => index)
      .filter(colorIndex => !availableColors.includes(colorIndex))
      .map(index => colorNames[index])
      .join(', ')

    return `${vertex} memiliki tetangga: ${neighborColors}. Warna ${conflictingColors} tidak dapat digunakan karena konflik dengan tetangga. Warna terkecil yang tersedia adalah ${colorNames[selectedColor]}.`
  }

  const handlePlay = () => {
    if (currentStep === steps.length - 1) {
      setCurrentStep(0)
      setColoredVertices(new Map())
    }
    setIsPlaying(!isPlaying)
  }

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setColoredVertices(new Map())
    setHighlightedVertex(null)
  }

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const newColored = new Map<string, number>()
      for (let i = 0; i <= currentStep; i++) {
        const step = steps[i]
        newColored.set(step.vertex, step.colorIndex)
      }
      setColoredVertices(newColored)
      setHighlightedVertex(steps[currentStep].vertex)
    }
  }, [currentStep, steps])

  const getVertexColor = (vertex: string) => {
    const colorIndex = coloredVertices.get(vertex)
    return colorIndex !== undefined ? colors[colorIndex] : '#e5e7eb'
  }

  const getVertexTextColor = (vertex: string) => {
    const colorIndex = coloredVertices.get(vertex)
    return colorIndex !== undefined ? '#ffffff' : '#374151'
  }

  const isVertexHighlighted = (vertex: string) => {
    return highlightedVertex === vertex
  }

  const isNeighborHighlighted = (vertex: string) => {
    if (!highlightedVertex) return false
    const currentStepData = steps[currentStep]
    return currentStepData?.neighbors.includes(vertex) || false
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Algoritma Greedy Coloring - Visualisasi Langkah demi Langkah
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={handlePlay}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button 
              onClick={handleStepForward}
              disabled={currentStep === steps.length - 1}
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Next Step
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <Progress 
                  value={steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0} 
                  className="flex-1"
                />
                <span className="text-sm font-medium">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
            </div>
          </div>

          {/* Graph Visualization */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visualisasi Graf</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Simple graph visualization */}
                  <div className="grid grid-cols-3 gap-4">
                    {skincareData.graf.vertices.map((vertex, index) => (
                      <motion.div
                        key={vertex}
                        initial={{ scale: 1 }}
                        animate={{ 
                          scale: isVertexHighlighted(vertex) ? 1.2 : 
                                 isNeighborHighlighted(vertex) ? 1.1 : 1,
                          backgroundColor: getVertexColor(vertex),
                          color: getVertexTextColor(vertex)
                        }}
                        transition={{ duration: 0.3 }}
                        className={`p-3 rounded-lg border-2 text-center font-medium text-sm ${
                          isVertexHighlighted(vertex) ? 'border-yellow-400 shadow-lg' :
                          isNeighborHighlighted(vertex) ? 'border-orange-400 shadow-md' :
                          'border-gray-300'
                        }`}
                      >
                        {vertex}
                        {coloredVertices.has(vertex) && (
                          <div className="text-xs mt-1 opacity-75">
                            Slot {coloredVertices.get(vertex)! + 1}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Edges visualization */}
                  <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
                    {skincareData.graf.edges.map((edge, index) => {
                      const fromIndex = skincareData.graf.vertices.indexOf(edge[0])
                      const toIndex = skincareData.graf.vertices.indexOf(edge[1])
                      
                      if (fromIndex === -1 || toIndex === -1) return null
                      
                      const fromRow = Math.floor(fromIndex / 3)
                      const fromCol = fromIndex % 3
                      const toRow = Math.floor(toIndex / 3)
                      const toCol = toIndex % 3
                      
                      const x1 = (fromCol + 0.5) * (100 / 3)
                      const y1 = (fromRow + 0.5) * (100 / 4)
                      const x2 = (toCol + 0.5) * (100 / 3)
                      const y2 = (toRow + 0.5) * (100 / 4)
                      
                      const conflict = skincareData.konflik.find(
                        k => (k.produkA === edge[0] && k.produkB === edge[1]) ||
                             (k.produkA === edge[1] && k.produkB === edge[0])
                      )
                      
                      const strokeColor = conflict?.tingkat === 'Tinggi' ? '#ef4444' :
                                         conflict?.tingkat === 'Sedang' ? '#f59e0b' : '#10b981'
                      const strokeWidth = conflict?.tingkat === 'Tinggi' ? 3 :
                                          conflict?.tingkat === 'Sedang' ? 2 : 1
                      
                      return (
                        <line
                          key={index}
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          opacity={0.6}
                        />
                      )
                    })}
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Langkah</CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {steps.length > 0 && currentStep < steps.length && (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">
                          Langkah {currentStep + 1}: Mewarnai {steps[currentStep].vertex}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Warna dipilih:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: steps[currentStep].color }}
                              />
                              <span>{colorNames[steps[currentStep].colorIndex]}</span>
                              <Badge variant="secondary">
                                Slot {steps[currentStep].colorIndex + 1}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <span className="font-medium">Tetangga:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {steps[currentStep].neighbors.map(neighbor => (
                                <Badge key={neighbor} variant="outline" className="text-xs">
                                  {neighbor}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="font-medium">Warna tersedia:</span>
                            <div className="flex gap-1 mt-1">
                              {steps[currentStep].availableColors.map(colorIndex => (
                                <div key={colorIndex} className="flex items-center gap-1">
                                  <div 
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: colors[colorIndex] }}
                                  />
                                  <span className="text-xs">{colorNames[colorIndex]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Alasan:</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {steps[currentStep].reason}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Results Summary */}
          {currentStep === steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold mb-4 text-green-700">🎉 Pewarnaan Selesai!</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Statistik</h4>
                  <p className="text-sm text-gray-600">
                    Jumlah Vertex: {skincareData.graf.vertices.length}<br/>
                    Jumlah Edge: {skincareData.graf.edges.length}<br/>
                    Jumlah Warna: {new Set(coloredVertices.values()).size}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Chromatic Number</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    χ(G) = {new Set(coloredVertices.values()).size}
                  </p>
                  <p className="text-sm text-gray-600">
                    Minimum warna yang dibutuhkan
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Interpretasi</h4>
                  <p className="text-sm text-gray-600">
                    Dibutuhkan {new Set(coloredVertices.values()).size} slot waktu berbeda 
                    untuk menghindari semua konflik bahan aktif.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}