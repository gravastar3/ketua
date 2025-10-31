'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Network } from 'vis-network/standalone'
import { DataSet } from 'vis-data'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, RotateCcw, Info, Zap } from 'lucide-react'
import skincareData from '@/data/skincareData.json'

interface GraphNode {
  id: string
  label: string
  color?: string
  font?: { color: string; size: number }
  size?: number
  title?: string
}

interface GraphEdge {
  from: string
  to: string
  color?: string
  width?: number
  title?: string
}

export default function GraphVisualization() {
  const networkRef = useRef<HTMLDivElement>(null)
  const [network, setNetwork] = useState<Network | null>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [coloringStep, setColoringStep] = useState(0)
  const [coloredNodes, setColoredNodes] = useState<Set<string>>(new Set())

  const colors = [
    '#f4a6c1', '#e8d5f2', '#b8e6f7', '#ffd4e5', '#c8f7e5', '#f5d0a9'
  ]

  const conflictLevels = {
    'Tinggi': { color: '#ef4444', width: 4 },
    'Sedang': { color: '#f59e0b', width: 3 },
    'Rendah': { color: '#10b981', width: 2 }
  }

  useEffect(() => {
    console.log('🔄 Network state changed:', network ? 'tersedia' : 'tidak tersedia')
    console.log('🎨 Is animating:', isAnimating)
    console.log('📊 Coloring step:', coloringStep)
    console.log('🔵 Colored nodes count:', coloredNodes.size)
  }, [network, isAnimating, coloringStep, coloredNodes])

  useEffect(() => {
    if (networkRef.current) {
      console.log('🚀 Inisialisasi Network...')
      const nodes = new DataSet<GraphNode>(
        skincareData.graf.vertices.map((vertex, index) => ({
          id: vertex,
          label: vertex,
          color: '#e5e7eb',
          font: { color: '#374151', size: 14 },
          size: 25,
          title: getProductInfo(vertex)
        }))
      )

      const edges = new DataSet<GraphEdge>(
        skincareData.graf.edges.map(edge => {
          const conflict = skincareData.konflik.find(
            k => (k.produkA === edge[0] && k.produkB === edge[1]) ||
                 (k.produkA === edge[1] && k.produkB === edge[0])
          )
          const level = conflict?.tingkat || 'Rendah'
          const levelConfig = conflictLevels[level as keyof typeof conflictLevels]
          
          return {
            from: edge[0],
            to: edge[1],
            color: levelConfig.color,
            width: levelConfig.width,
            title: `${edge[0]} - ${edge[1]} (${level})`
          }
        })
      )

      const data = { nodes, edges }
      
      const options = {
        layout: {
          improvedLayout: true,
          hierarchical: {
            enabled: false
          }
        },
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.04,
            damping: 0.09
          }
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
          dragView: true
        },
        nodes: {
          shape: 'dot',
          borderWidth: 2,
          borderWidthSelected: 4,
          shadow: true
        },
        edges: {
          smooth: {
            type: 'continuous',
            roundness: 0.5
          },
          shadow: true
        }
      }

      const networkInstance = new Network(networkRef.current, data, options)
      console.log('✅ Network instance berhasil dibuat!')
      
      networkInstance.on('click', (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0]
          const node = skincareData.produk.find(p => p.nama === nodeId)
          setSelectedNode(node)
          console.log('🖱️ Node diklik:', nodeId)
        }
      })

      networkInstance.on('hoverNode', (params) => {
        networkInstance.canvas.body.container.style.cursor = 'pointer'
      })

      networkInstance.on('blurNode', (params) => {
        networkInstance.canvas.body.container.style.cursor = 'default'
      })

      setNetwork(networkInstance)
      console.log('✅ Network state diset!')

      return () => {
        networkInstance.destroy()
      }
    }
  }, [])

  const getProductInfo = (productName: string) => {
    const product = skincareData.produk.find(p => p.nama === productName)
    if (!product) return productName
    
    return `
      <div style="padding: 8px;">
        <strong>${product.nama}</strong><br/>
        <em>Bahan:</em> ${product.bahan}<br/>
        <em>Fungsi:</em> ${product.fungsi}<br/>
        <em>Frekuensi:</em> ${product.frekuensi}
      </div>
    `
  }

  const getDegree = useCallback((vertex: string) => {
    return skincareData.graf.edges.filter(
      edge => edge[0] === vertex || edge[1] === vertex
    ).length
  }, [])

  const getSortedVertices = useCallback(() => {
    return [...skincareData.graf.vertices].sort((a, b) => getDegree(b) - getDegree(a))
  }, [getDegree])

  const getAvailableColor = useCallback((vertex: string, colored: Map<string, number>) => {
    const neighbors = skincareData.graf.edges
      .filter(edge => edge[0] === vertex || edge[1] === vertex)
      .map(edge => edge[0] === vertex ? edge[1] : edge[0])

    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      const hasConflict = neighbors.some(neighbor => 
        colored.get(neighbor) === colorIndex
      )
      if (!hasConflict) return colorIndex
    }
    return colors.length - 1
  }, [])

  const startGreedyColoring = useCallback(() => {
    console.log('🎨 Tombol Pewarnaan Greedy diklik!')
    console.log('📊 Network instance:', network ? 'tersedia' : 'tidak tersedia')
    console.log('🔄 Is animating:', isAnimating)
    console.log('📋 Data vertices:', skincareData.graf.vertices)
    console.log('📋 Data edges:', skincareData.graf.edges)
    
    if (!network) {
      console.log('❌ Network instance tidak tersedia')
      return
    }
    
    if (isAnimating) {
      console.log('❌ Animasi sedang berjalan')
      return
    }

    // Validasi data
    if (!skincareData.graf.vertices || skincareData.graf.vertices.length === 0) {
      console.log('❌ Data vertices kosong')
      return
    }

    if (!skincareData.graf.edges || skincareData.graf.edges.length === 0) {
      console.log('❌ Data edges kosong')
      return
    }

    console.log('✅ Memulai proses pewarnaan greedy...')
    setIsAnimating(true)
    setColoringStep(0)
    setColoredNodes(new Set())

    const sortedVertices = getSortedVertices()
    const colored = new Map<string, number>()
    const colorAssignments: { vertex: string; color: string; step: number; colorIndex: number }[] = []

    console.log('📋 Urutan vertex yang akan diwarnai:', sortedVertices)

    sortedVertices.forEach((vertex, index) => {
      const colorIndex = getAvailableColor(vertex, colored)
      colored.set(vertex, colorIndex)
      colorAssignments.push({
        vertex,
        color: colors[colorIndex],
        colorIndex,
        step: index + 1
      })
      console.log(`🎨 Step ${index + 1}: ${vertex} -> warna ${colorIndex} (${colors[colorIndex]})`)
    })

    console.log('🚀 Memulai animasi pewarnaan...')
    
    colorAssignments.forEach((assignment, index) => {
      setTimeout(() => {
        console.log(`⚡ Menjalankan step ${index + 1}: ${assignment.vertex}`)
        
        try {
          // Update node dengan warna baru
          network.updateNode(assignment.vertex, {
            color: assignment.color,
            font: { color: '#ffffff', size: 16, bold: true }
          })
          
          console.log(`✅ Node ${assignment.vertex} berhasil diwarnai dengan ${assignment.color}`)
        } catch (error) {
          console.error(`❌ Gagal mengupdate node ${assignment.vertex}:`, error)
        }
        
        // Update state
        setColoredNodes(prev => new Set([...prev, assignment.vertex]))
        setColoringStep(index + 1)

        // Check if this is the last step
        if (index === colorAssignments.length - 1) {
          console.log('🎉 Pewarnaan selesai!')
          setTimeout(() => {
            setIsAnimating(false)
            console.log('✅ Animasi selesai, state direset')
          }, 1000)
        }
      }, (index + 1) * 1500)
    })
  }, [network, isAnimating, getSortedVertices, getAvailableColor, colors, skincareData.graf.vertices])

  const resetGraph = useCallback(() => {
    console.log('🔄 Tombol Reset diklik!')
    
    if (!network) {
      console.log('❌ Network instance tidak tersedia untuk reset')
      return
    }

    console.log('🔄 Mereset semua node ke warna default...')
    
    skincareData.graf.vertices.forEach(vertex => {
      network.updateNode(vertex, {
        color: '#e5e7eb',
        font: { color: '#374151', size: 14, bold: false }
      })
    })

    setColoredNodes(new Set())
    setColoringStep(0)
    setIsAnimating(false)
    setSelectedNode(null)
    
    console.log('✅ Reset selesai!')
  }, [network])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="w-6 h-6 text-yellow-500" />
            Visualisasi Graf Konflik Skincare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="graph" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="graph">Graf Konflik</TabsTrigger>
              <TabsTrigger value="algorithm">Algoritma Greedy</TabsTrigger>
              <TabsTrigger value="legend">Legenda</TabsTrigger>
            </TabsList>

            <TabsContent value="graph" className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Button 
                  onClick={() => {
                    console.log('🖱️ Tombol diklik! Memanggil startGreedyColoring...')
                    startGreedyColoring()
                  }}
                  disabled={isAnimating}
                  className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isAnimating ? 'Sedang Mewarnai...' : 'Mulai Pewarnaan Greedy'}
                </Button>
                <Button 
                  onClick={() => {
                    console.log('🖱️ Tombol Reset diklik! Memanggil resetGraph...')
                    resetGraph()
                  }}
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                {isAnimating && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    Langkah {coloringStep} dari {skincareData.graf.vertices.length}
                  </Badge>
                )}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div 
                    ref={networkRef} 
                    className="h-96 bg-white rounded-lg border border-gray-200"
                  />
                </div>

                <div className="space-y-4">
                  {selectedNode && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card className="bg-gradient-to-br from-pink-50 to-purple-50">
                        <CardHeader>
                          <CardTitle className="text-lg">{selectedNode.nama}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <span className="font-semibold">Bahan Aktif:</span>
                            <p className="text-sm text-gray-600">{selectedNode.bahan}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Fungsi:</span>
                            <p className="text-sm text-gray-600">{selectedNode.fungsi}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Frekuensi:</span>
                            <p className="text-sm text-gray-600">{selectedNode.frekuensi}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Cocok untuk:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedNode.jenisKulit.map((type: string) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        Tips Interaksi
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p>• <strong>Klik node</strong> untuk melihat detail produk</p>
                      <p>• <strong>Hover</strong> untuk preview cepat</p>
                      <p>• <strong>Scroll</strong> untuk zoom in/out</p>
                      <p>• <strong>Drag</strong> untuk memindahkan posisi</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="algorithm" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Algoritma Greedy Coloring</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Langkah-langkah:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Urutkan simpul berdasarkan derajat (jumlah konflik) tertinggi</li>
                      <li>Warnai setiap simpul dengan warna terkecil yang tersedia</li>
                      <li>Pastikan tidak ada dua simpul bertetangga memiliki warna sama</li>
                      <li>Lanjutkan hingga semua simpul diwarnai</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Urutan Pewarnaan (berdasarkan derajat):</h4>
                    <div className="space-y-1">
                      {getSortedVertices().map((vertex, index) => (
                        <div key={vertex} className="flex items-center gap-2 text-sm">
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                            {index + 1}
                          </span>
                          <span>{vertex}</span>
                          <span className="text-gray-500">(derajat: {getDegree(vertex)})</span>
                          {coloredNodes.has(vertex) && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              ✓ Diwarnai
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Kompleksitas Waktu:</h4>
                    <p className="text-sm">
                      Algoritma Greedy Coloring memiliki kompleksitas waktu <strong>O(V + E)</strong>, 
                      dimana V adalah jumlah vertex (produk) dan E adalah jumlah edge (konflik).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legend" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tingkat Konflik</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(conflictLevels).map(([level, config]) => (
                      <div key={level} className="flex items-center gap-3">
                        <div 
                          className="w-8 h-1 rounded"
                          style={{ backgroundColor: config.color, height: `${config.width}px` }}
                        />
                        <span className="text-sm font-medium">{level}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Warna Slot Waktu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm">Slot {index + 1}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}