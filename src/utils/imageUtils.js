// 图片工具函数，用于处理图片异常

// 本地图片替代方案
const localImages = {
  'modern minimalist sofa': 'sofa.png',
  'solid wood coffee table': 'coffee-table.png',
  'nordic style double bed': 'bed.png',
  'four door wardrobe': 'wardrobe.png',
  'solid wood dining table': 'dining-table.png',
  'fabric sofa': 'fabric-sofa.png',
  'glass coffee table': 'glass-table.png',
  'children bed': 'children-bed.png',
  'product image': 'product.png',
  'high quality wood': 'wood.png',
  'hardware parts': 'hardware.png',
  'cabinet door': 'cabinet-door.png',
  'drawer': 'drawer.png',
  'wardrobe': 'wardrobe.png',
  'modern simple three bedroom apartment': 'apartment1.png',
  'european classical villa': 'villa1.png',
  'chinese style duplex apartment': 'apartment2.png',
  'nordic style two bedroom apartment': 'apartment3.png',
  'modern simple apartment': 'apartment4.png',
  'nordic style villa': 'villa2.png',
  'modern simple kitchen cabinet': 'kitchen-cabinet.png',
  'european style wardrobe': 'european-wardrobe.png',
  'smart bathroom cabinet': 'bathroom-cabinet.png',
  'stainless steel hardware parts': 'stainless-steel.png',
  'modern simple dining table': 'modern-dining-table.png',
  'european style sofa': 'european-sofa.png'
}

// 获取图片URL，优先使用本地图片，如果没有则使用外部API
const getImageUrl = (prompt, size = 'square_hd') => {
  // 尝试从本地图片中查找
  const normalizedPrompt = prompt.toLowerCase().trim()
  for (const [key, value] of Object.entries(localImages)) {
    if (normalizedPrompt.includes(key)) {
      return new URL(`../assets/images/${value}`, import.meta.url).href
    }
  }
  
  // 如果没有本地图片，则使用外部API
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`
}

// 处理图片加载错误
const handleImageError = (event) => {
  // 使用默认图片替代
  event.target.src = new URL('../assets/images/default.png', import.meta.url).href
  event.target.onerror = null // 防止循环错误
}

export { getImageUrl, handleImageError }
