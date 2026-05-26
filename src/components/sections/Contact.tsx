"use client";
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
  botcheck: z.boolean().optional()
});

type FormData = z.infer<typeof formSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      botcheck: false
    }
  });

  const onSubmit = async (data: FormData) => {
    if (data.botcheck) {
      toast.error("Spam detected.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE",
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully! I'll get back to you soon.");
        reset();
      } else {
        toast.error(result.message || "Something went wrong. Please try again later.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Contact</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Get in touch before I turn another idea into a dashboard.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            I'm open to internships, placement opportunities, junior developer roles, software projects, freelance-style web work and collaborations around 6ixtype.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mt-4">
            Use the form to contact me about opportunities, projects or anything related to web development, dashboards, software systems or practical tech ideas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <input type="checkbox" className="hidden" style={{ display: 'none' }} {...register("botcheck")} />

              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Your name"
                  className="bg-input-background"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="your.email@example.com"
                  className="bg-input-background"
                  disabled={isSubmitting}
                />
                {errors.email ? (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Temporary emails are fine, but use a real one if you want me to reply.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="Your message..."
                  rows={6}
                  className="bg-input-background resize-none"
                  disabled={isSubmitting}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
