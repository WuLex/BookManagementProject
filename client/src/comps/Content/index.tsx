import { defineComponent, renderSlot } from 'vue'

//vue3中，新增了 defineComponent ，它并没有实现任何的逻辑，只是把接收的 Object 直接返回，它的存在是完全让传入的整个对象获得对应的类型，它的存在就是完全为了服务 TypeScript 而存在的。

//这里拿到this.$slots[name]的值后做了一个空值判断，若存在则直接返回其对应的 vnode 数组，否则返回 fallback 。

export default defineComponent({
  name: 'Content',
  setup(props, { slots }) {
    return () => (
      <section
        class="content"
        style={{ margin: '16px', padding: '16px', background: '#ffffff' }}
      >
        {renderSlot(slots, 'default')} 
      </section>
    )
  },
})
