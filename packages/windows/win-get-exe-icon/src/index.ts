// INSPIRED BY:
// https://github.com/zxch3n/get-app-icon

/* eslint-disable @typescript-eslint/no-explicit-any */
let winIcon: any

export function extractIcon(path: string): Promise<string> {
  if (!winIcon) {
    winIcon = require('icon-extractor')
  }

  return new Promise((resolve, reject) => {
    let resolved = false
    winIcon.emitter.on('icon', function (data: any) {
      if (data.Context === path) {
        resolved = true
        resolve('data:image/png;base64,' + data.Base64ImageData)
      }
    })

    winIcon.getIcon(path, path)
    setTimeout(() => {
      if (!resolved) {
        reject()
      }
    }, 3000)
  })
}
