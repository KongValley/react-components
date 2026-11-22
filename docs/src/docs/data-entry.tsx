import type { ComponentDoc } from './types';
import InputBasic from '../examples/input/Basic';
import inputBasicCode from '../examples/input/Basic?raw';
import InputTextArea from '../examples/input/TextArea';
import inputTextAreaCode from '../examples/input/TextArea?raw';
import InputPassword from '../examples/input/Password';
import inputPasswordCode from '../examples/input/Password?raw';
import InputNumberBasic from '../examples/input-number/Basic';
import inputNumberBasicCode from '../examples/input-number/Basic?raw';
import InputNumberFormatter from '../examples/input-number/Formatter';
import inputNumberFormatterCode from '../examples/input-number/Formatter?raw';
import SelectBasic from '../examples/select/Basic';
import selectBasicCode from '../examples/select/Basic?raw';
import SelectSearch from '../examples/select/Search';
import selectSearchCode from '../examples/select/Search?raw';
import CheckboxBasic from '../examples/checkbox/Basic';
import checkboxBasicCode from '../examples/checkbox/Basic?raw';
import RadioBasic from '../examples/radio/Basic';
import radioBasicCode from '../examples/radio/Basic?raw';
import SwitchBasic from '../examples/switch/Basic';
import switchBasicCode from '../examples/switch/Basic?raw';
import FormBasic from '../examples/form/Basic';
import formBasicCode from '../examples/form/Basic?raw';
import FormHorizontal from '../examples/form/Horizontal';
import formHorizontalCode from '../examples/form/Horizontal?raw';

export const dataEntryDocs: ComponentDoc[] = [
  {
    key: 'input',
    name: 'Input 输入框',
    english: 'Input',
    description:
      '基础文本输入控件，支持前后缀、前置/后置标签、清除、字数统计，以及 TextArea 与 Password 两种衍生形态。',
    demos: [
      {
        title: '基础用法',
        description: '组合 prefix、suffix、addon 与 showCount，满足常见输入场景。',
        code: inputBasicCode,
        element: <InputBasic />,
      },
      {
        title: '文本域',
        description: 'autoSize 让文本域在 minRows 与 maxRows 之间随内容伸缩。',
        code: inputTextAreaCode,
        element: <InputTextArea />,
      },
      {
        title: '密码输入',
        description: 'Input.Password 内置可见性切换按钮，可用 visibilityToggle 关闭。',
        code: inputPasswordCode,
        element: <InputPassword />,
      },
    ],
    api: [
      { prop: 'size', type: "'small' | 'middle' | 'large'", defaultValue: "'middle'", description: '控件尺寸。' },
      { prop: 'status', type: "'error' | 'warning'", description: '校验状态样式。' },
      { prop: 'allowClear', type: 'boolean', defaultValue: 'false', description: '有值时展示清除按钮。' },
      { prop: 'prefix / suffix', type: 'ReactNode', description: '输入框内部的前缀/后缀。' },
      { prop: 'addonBefore / addonAfter', type: 'ReactNode', description: '输入框外部的组合标签。' },
      { prop: 'showCount', type: 'boolean', defaultValue: 'false', description: '显示字符数（可结合 maxLength）。' },
      { prop: 'onPressEnter', type: '(event) => void', description: '按下回车时触发。' },
      { prop: 'onClear', type: '() => void', description: '点击清除按钮时触发。' },
      { prop: 'TextArea.autoSize', type: 'boolean | { minRows?, maxRows? }', defaultValue: 'false', description: '文本域高度随内容自动调整。' },
      { prop: 'Password.visibilityToggle', type: 'boolean', defaultValue: 'true', description: '是否展示密码可见性切换。' },
      { prop: '...rest', type: 'InputHTMLAttributes / TextareaHTMLAttributes', description: '透传原生属性。' },
    ],
  },
  {
    key: 'input-number',
    name: 'InputNumber 数字输入框',
    english: 'InputNumber',
    description:
      '带步进器的数字输入控件，支持最小/最大值、步长、精度、格式化与解析，键盘上下方向键同样可用。',
    demos: [
      {
        title: '基础用法',
        description: '超出范围的输入会在失焦时自动收敛到 min/max，precision 控制小数位。',
        code: inputNumberBasicCode,
        element: <InputNumberBasic />,
      },
      {
        title: '格式化',
        description: 'formatter 控制显示格式，parser 负责把显示值还原为数字。',
        code: inputNumberFormatterCode,
        element: <InputNumberFormatter />,
      },
    ],
    api: [
      { prop: 'value / defaultValue', type: 'number | null', description: '受控/非受控值。' },
      { prop: 'onChange', type: '(value: number | null) => void', description: '数值变化时触发。' },
      { prop: 'min / max', type: 'number', description: '允许的最小/最大值。' },
      { prop: 'step', type: 'number', defaultValue: '1', description: '步进值。' },
      { prop: 'precision', type: 'number', description: '保留的小数位数。' },
      { prop: 'controls', type: 'boolean', defaultValue: 'true', description: '是否显示上下步进按钮。' },
      { prop: 'formatter', type: '(value: number | string) => string', description: '格式化展示值。' },
      { prop: 'parser', type: '(display: string) => number | string', description: '将展示值解析为数值。' },
      { prop: 'size / status', type: 'InputSize / InputStatus', description: '与 Input 一致。' },
      { prop: 'onPressEnter', type: '(event) => void', description: '按下回车时触发。' },
    ],
  },
  {
    key: 'select',
    name: 'Select 选择器',
    english: 'Select',
    description:
      '下拉选择控件，支持单选、多选、搜索过滤、分组选项、清除与键盘导航，浮层自动翻转并跟随滚动；开启 adaptive 后会在移动端切换为底部选项面板。',
    demos: [
      {
        title: '基础用法',
        description: '传入 options 数组，支持禁用项、清除与受控/非受控值。',
        code: selectBasicCode,
        element: <SelectBasic />,
      },
      {
        title: '多选与搜索',
        description: 'mode="multiple" 使用标签展示已选项，showSearch 打开关键词过滤。',
        code: selectSearchCode,
        element: <SelectSearch />,
      },
    ],
    api: [
      { prop: 'options', type: 'Array<SelectOption | SelectOptionGroup>', defaultValue: '[]', description: '选项数据，支持分组。' },
      { prop: 'value / defaultValue', type: 'SelectValue | SelectValue[] | null', description: '受控/非受控值，多选时为数组。' },
      { prop: 'onChange', type: '(value) => void', description: '选中项变化时触发。' },
      { prop: 'mode', type: "'single' | 'multiple'", defaultValue: "'single'", description: '单选或多选模式。' },
      { prop: 'showSearch', type: 'boolean', defaultValue: 'false', description: '展示搜索输入框。' },
      { prop: 'filterOption', type: 'boolean | (input, option) => boolean', defaultValue: 'true', description: '搜索过滤策略。' },
      { prop: 'allowClear', type: 'boolean', defaultValue: 'false', description: '展示清除按钮。' },
      { prop: 'placeholder', type: 'ReactNode', defaultValue: "'Please select'", description: '未选择时的占位内容。' },
      { prop: 'notFoundContent', type: 'ReactNode', description: '无匹配选项时的内容。' },
      { prop: 'loading', type: 'boolean', defaultValue: 'false', description: '加载状态。' },
      { prop: 'open / onOpenChange', type: 'boolean / (open) => void', description: '受控的展开状态。' },
      { prop: 'placement', type: 'Placement', defaultValue: "'bottom-start'", description: '浮层出现位置，空间不足时自动翻转。' },
      { prop: 'size / status', type: 'InputSize / InputStatus', description: '与 Input 一致。' },
      { prop: 'adaptive', type: 'boolean', description: '移动端使用底部选项面板；默认继承 ConfigProvider.adaptive。' },
      { prop: 'mobileTitle', type: 'ReactNode', description: '移动端面板标题，默认使用 placeholder。' },
    ],
  },
  {
    key: 'checkbox',
    name: 'Checkbox 复选框',
    english: 'Checkbox',
    description:
      '一组选项中的多项选择，支持受控、非受控、半选状态与 Checkbox.Group 分组管理。',
    demos: [
      {
        title: '基础与全选',
        description: 'indeterminate 展示半选状态；Checkbox.Group 通过 value/onChange 管理数组值。',
        code: checkboxBasicCode,
        element: <CheckboxBasic />,
      },
    ],
    api: [
      { prop: 'checked / defaultChecked', type: 'boolean', description: '受控/非受控选中状态。' },
      { prop: 'indeterminate', type: 'boolean', defaultValue: 'false', description: '半选状态。' },
      { prop: 'onChange', type: '(event) => void', description: '选中状态变化时触发。' },
      { prop: 'value', type: 'string | number', description: '在 Group 中标识该选项。' },
      { prop: 'Group.options', type: 'Array<{ label, value, disabled? } | string | number>', description: '选项列表。' },
      { prop: 'Group.value / defaultValue', type: 'Array<string | number>', description: '选中的值集合。' },
      { prop: 'Group.onChange', type: '(value[]) => void', description: '选中集合变化时触发。' },
      { prop: 'Group.direction', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: '排列方向。' },
      { prop: 'Group.disabled', type: 'boolean', description: '禁用整组。' },
    ],
  },
  {
    key: 'radio',
    name: 'Radio 单选框',
    english: 'Radio',
    description:
      '一组互斥选项中选中一项。Radio.Group 支持普通圆点与按钮两种形态，按钮模式可切换描边/实心风格。',
    demos: [
      {
        title: '基础与按钮模式',
        description: '原生 radio 保证键盘方向键切换；buttonStyle="solid" 提供实心选中样式。',
        code: radioBasicCode,
        element: <RadioBasic />,
      },
    ],
    api: [
      { prop: 'checked / defaultChecked', type: 'boolean', description: '单选按钮自身的选中状态。' },
      { prop: 'value', type: 'string | number', description: '在 Group 中标识该选项。' },
      { prop: 'onChange', type: '(event) => void', description: '选中时触发。' },
      { prop: 'Group.options', type: 'Array<{ label, value, disabled? } | string | number>', description: '选项列表。' },
      { prop: 'Group.value / defaultValue', type: 'string | number', description: '当前选中的值。' },
      { prop: 'Group.onChange', type: '(value) => void', description: '选中项变化时触发。' },
      { prop: 'Group.optionType', type: "'default' | 'button'", defaultValue: "'default'", description: '圆点或按钮形态。' },
      { prop: 'Group.buttonStyle', type: "'outline' | 'solid'", defaultValue: "'outline'", description: '按钮模式的选中样式。' },
      { prop: 'Group.size', type: "'small' | 'middle' | 'large'", defaultValue: "'middle'", description: '按钮模式的尺寸。' },
      { prop: 'Group.disabled', type: 'boolean', description: '禁用整组。' },
    ],
  },
  {
    key: 'switch',
    name: 'Switch 开关',
    english: 'Switch',
    description: '在两个互斥状态之间切换，支持受控、尺寸、加载与内部文案。',
    demos: [
      {
        title: '基础用法',
        description: '按钮语义使用 role="switch" 与 aria-checked，键盘可切换。',
        code: switchBasicCode,
        element: <SwitchBasic />,
      },
    ],
    api: [
      { prop: 'checked / defaultChecked', type: 'boolean', defaultValue: 'false', description: '受控/非受控状态。' },
      { prop: 'onChange', type: '(checked: boolean) => void', description: '状态变化时触发。' },
      { prop: 'size', type: "'small' | 'default'", defaultValue: "'default'", description: '开关尺寸。' },
      { prop: 'loading', type: 'boolean', defaultValue: 'false', description: '展示加载图标并禁用交互。' },
      { prop: 'checkedChildren', type: 'ReactNode', description: '选中状态下的文案。' },
      { prop: 'unCheckedChildren', type: 'ReactNode', description: '未选中状态下的文案。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用开关。' },
    ],
  },
  {
    key: 'form',
    name: 'Form 表单',
    english: 'Form',
    description:
      '集中管理字段值、校验规则与提交状态。Form.Item 通过克隆控件注入 value/onChange，支持同步与异步校验、布局与反馈图标。',
    whenToUse:
      '需要统一收集、校验和提交一组数据时使用。简单单字段场景可以直接受控使用控件。',
    demos: [
      {
        title: '基础表单',
        description: '必填、长度、邮箱与自定义文案校验；校验失败时展示第一条错误信息。',
        code: formBasicCode,
        element: <FormBasic />,
      },
      {
        title: '水平布局',
        description: 'layout="horizontal" 配合 labelWidth 控制标签列宽度。',
        code: formHorizontalCode,
        element: <FormHorizontal />,
      },
    ],
    api: [
      { prop: 'form', type: 'FormInstance', description: '外部创建的 Form 实例，通常来自 Form.useForm()。' },
      { prop: 'initialValues', type: 'Record<string, unknown>', description: '表单初始值。' },
      { prop: 'layout', type: "'horizontal' | 'vertical' | 'inline'", defaultValue: "'vertical'", description: '表单布局。' },
      { prop: 'labelWidth', type: 'number | string', defaultValue: '120px', description: '水平布局的标签列宽度。' },
      { prop: 'labelAlign', type: "'left' | 'right'", defaultValue: "'right'", description: '标签对齐方式。' },
      { prop: 'size', type: "'small' | 'middle' | 'large'", defaultValue: "'middle'", description: '表单尺寸。' },
      { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用所有字段。' },
      { prop: 'onFinish', type: '(values) => void', description: '全部校验通过后触发。' },
      { prop: 'onFinishFailed', type: '(info: FormErrorInfo) => void', description: '校验失败时触发。' },
      { prop: 'Item.name', type: 'string | number | (string | number)[]', description: '字段路径，支持嵌套数组。' },
      { prop: 'Item.rules', type: 'FormRule[]', description: '校验规则：required / min / max / len / pattern / type / validator 等。' },
      { prop: 'Item.label / required / help / extra', type: 'ReactNode / boolean / ReactNode / ReactNode', description: '标签、必填星号与辅助文案。' },
      { prop: 'Item.valuePropName', type: 'string', defaultValue: "'value'", description: '注入控件的值属性名，Checkbox/Switch 用 checked。' },
      { prop: 'Item.trigger', type: 'string', defaultValue: "'onChange'", description: '触发字段更新的控件事件名。' },
      { prop: 'Item.getValueFromEvent', type: '(...args) => unknown', description: '从控件事件中提取字段值。' },
      { prop: 'Item.noStyle', type: 'boolean', defaultValue: 'false', description: '只渲染控件，不渲染标签与错误容器。' },
      { prop: 'useForm()', type: '[FormInstance]', description: '创建表单实例，提供 validateFields / resetFields / setFieldsValue / submit 等方法。' },
    ],
  },
];
