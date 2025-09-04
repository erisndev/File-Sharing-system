import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8">
          <h1 className="text-3xl font-bold">Contact Support</h1>
          <p className="text-indigo-100">Have a question? Send us a message.</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>We will get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="How can we help?" required />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea rows={6} placeholder="Describe your issue or question..." required />
              </div>
              <Button type="submit" className="w-full">Send</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ContactPage;
