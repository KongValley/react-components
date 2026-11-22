import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Form } from '../Form';
import { Input } from '../../input/Input';
import { Button } from '../../button/Button';
import { InputNumber } from '../../input-number/InputNumber';
import { Select } from '../../select/Select';

function DemoForm({
  onFinish,
  onFinishFailed,
}: {
  onFinish?: (values: Record<string, unknown>) => void;
  onFinishFailed?: (info: unknown) => void;
}) {
  const [form] = Form.useForm();
  return (
    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Username is required' }]}
      >
        <Input placeholder="username" />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: 'email', message: 'Invalid email' }]}
      >
        <Input placeholder="email" />
      </Form.Item>
      <Button htmlType="submit">Submit</Button>
      <Button onClick={() => form.resetFields()}>
        Reset
      </Button>
      <Button onClick={() => form.setFieldValue('username', 'programmatic')}>
        Fill
      </Button>
    </Form>
  );
}

describe('Form', () => {
  it('validates required fields and reports failures', async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    render(<DemoForm onFinish={onFinish} onFinishFailed={onFinishFailed} />);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(onFinish).not.toHaveBeenCalled();
    expect(onFinishFailed).toHaveBeenCalledWith(
      expect.objectContaining({
        errorFields: [expect.objectContaining({ errors: ['Username is required'] })],
      }),
    );
  });

  it('clears errors on change and submits trimmed values', async () => {
    const onFinish = vi.fn();
    render(<DemoForm onFinish={onFinish} />);

    const username = screen.getByPlaceholderText('username');
    const email = screen.getByPlaceholderText('email');

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Username is required')).toBeInTheDocument();

    await userEvent.type(username, 'ada');
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();

    await userEvent.type(email, 'ada@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(onFinish).toHaveBeenCalledWith({
        username: 'ada',
        email: 'ada@example.com',
      }),
    );
  });

  it('supports programmatic set and reset', async () => {
    render(<DemoForm />);
    const username = screen.getByPlaceholderText('username');

    await userEvent.click(screen.getByRole('button', { name: 'Fill' }));
    expect(username).toHaveValue('programmatic');

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(username).toHaveValue('');
  });
});

describe('Form reset with complex controls', () => {
  function ComplexForm() {
    const [form] = Form.useForm();
    return (
      <Form form={form}>
        <Form.Item name="age" label="Age">
          <InputNumber placeholder="age" />
        </Form.Item>
        <Form.Item name="role" label="Role">
          <Select
            placeholder="role"
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Member', value: 'member' },
            ]}
          />
        </Form.Item>
        <Button
          onClick={() => form.setFieldsValue({ age: 9, role: 'admin' })}
        >
          Fill
        </Button>
        <Button onClick={() => form.resetFields()}>
          Clear
        </Button>
      </Form>
    );
  }

  it('returns controls to their empty state when reset value is undefined', async () => {
    render(<ComplexForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Fill' }));
    expect(screen.getByRole('spinbutton')).toHaveValue('9');
    expect(screen.getByRole('combobox')).toHaveTextContent('Admin');

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('spinbutton')).toHaveValue('');
    expect(screen.getByRole('combobox')).toHaveTextContent('role');
  });
});
