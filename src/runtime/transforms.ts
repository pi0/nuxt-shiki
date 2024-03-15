import type { ShikiTransformer } from 'shiki'

export const unwrapTransformer: ShikiTransformer = {
  name: 'unwrap',
  root: (root) => {
    const preEl = root.children[0] as any
    const codeEl = preEl.children[0]
    return {
      type: 'root',
      children: [
        {
          ...codeEl,
          properties: {
            ...preEl.properties,
            ...codeEl.properties,
          },
        },
      ],
    }
  },
}
