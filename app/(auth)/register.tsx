import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, Chip, Field, Input, TopBar, Row } from '@/components/ui';
import { DISTRICTS, STATES } from '@/data';
import { spacing, type } from '@/constants/theme';

const schema = z.object({
  name: z.string().min(3, 'Enter your full name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10 digit mobile number'),
  email: z.string().email('Enter a valid email').or(z.literal('')),
  state: z.string().min(1, 'Select a state'),
  district: z.string().min(1, 'Select a district'),
});
type Form = z.infer<typeof schema>;

export default function Register() {
  const [state, setState] = useState('Telangana');
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '', state: 'Telangana', district: '' },
  });

  const onSubmit = (v: Form) =>
    router.push({ pathname: '/(auth)/role', params: { name: v.name, phone: v.phone, district: v.district, state: v.state } });

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <TopBar title="Create your account" subtitle="Takes about a minute" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <Card>
            <Controller control={control} name="name" render={({ field }) => (
              <Field label="Full name" error={errors.name?.message}>
                <Input value={field.value} onChangeText={field.onChange} placeholder="e.g. Ramesh Reddy" invalid={!!errors.name} />
              </Field>
            )} />
            <Controller control={control} name="phone" render={({ field }) => (
              <Field label="Mobile number" error={errors.phone?.message}>
                <Input value={field.value} onChangeText={field.onChange} keyboardType="number-pad" maxLength={10} placeholder="10 digit number" invalid={!!errors.phone} />
              </Field>
            )} />
            <Controller control={control} name="email" render={({ field }) => (
              <Field label="Email (optional)" error={errors.email?.message}>
                <Input value={field.value} onChangeText={field.onChange} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" invalid={!!errors.email} />
              </Field>
            )} />

            <Field label="State" error={errors.state?.message}>
              <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                {STATES.map(s => (
                  <Chip key={s} label={s} active={state === s} onPress={() => {
                    setState(s); setValue('state', s); setValue('district', '');
                  }} />
                ))}
              </Row>
            </Field>

            <Controller control={control} name="district" render={({ field }) => (
              <Field label="District" error={errors.district?.message}>
                <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                  {DISTRICTS[state].map(d => (
                    <Chip key={d} label={d} active={field.value === d} onPress={() => field.onChange(d)} />
                  ))}
                </Row>
              </Field>
            )} />

            <Button title="Continue" onPress={handleSubmit(onSubmit)} />
            <Text style={[type.small, { textAlign: 'center', marginTop: 14, fontSize: 11.5 }]}>
              By continuing you agree to the KETHWADI terms of use and land leasing policy.
            </Text>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
