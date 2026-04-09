import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Endpoint } from "@/lib/types";
import { Save, Settings, FileText, Code, Globe } from "lucide-react";

const formSchema = z.object({
  path: z.string().min(1, "Path is required").regex(/^\//, "Path must start with /"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  targetUrl: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
  defaultPayload: z.string().optional(),
  customHeaders: z.string().optional(),
  isActive: z.boolean(),
  enableCors: z.boolean(),
  enableLogging: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface EditEndpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  endpoint: Endpoint | null;
}

export function EditEndpointModal({ isOpen, onClose, onSuccess, endpoint }: EditEndpointModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      path: endpoint?.path || "",
      method: endpoint?.method as any || "POST",
      targetUrl: endpoint?.targetUrl || "",
      description: endpoint?.description || "",
      defaultPayload: endpoint?.defaultPayload ? JSON.stringify(endpoint.defaultPayload, null, 2) : "",
      customHeaders: endpoint?.customHeaders ? JSON.stringify(endpoint.customHeaders, null, 2) : "",
      isActive: endpoint?.isActive ?? true,
      enableCors: endpoint?.enableCors ?? true,
      enableLogging: endpoint?.enableLogging ?? true,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!endpoint) throw new Error("No endpoint to update");
      
      let parsedPayload = null;
      let parsedHeaders = null;

      if (data.defaultPayload?.trim()) {
        try {
          parsedPayload = JSON.parse(data.defaultPayload);
        } catch (e) {
          throw new Error("Invalid JSON in default payload");
        }
      }

      if (data.customHeaders?.trim()) {
        try {
          parsedHeaders = JSON.parse(data.customHeaders);
        } catch (e) {
          throw new Error("Invalid JSON in custom headers");
        }
      }

      const updateData = {
        ...data,
        defaultPayload: parsedPayload,
        customHeaders: parsedHeaders,
      };

      return apiRequest("PUT", `/api/endpoints/${endpoint.id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/endpoints"] });
      toast({
        title: "Success",
        description: "Endpoint updated successfully",
      });
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update endpoint",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!endpoint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-blue-600" />
            Edit Endpoint
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Configuration */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Basic Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endpoint Path</FormLabel>
                      <FormControl>
                        <Input placeholder="/api/my-endpoint" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HTTP Method</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Target URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-n8n-webhook-url.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of what this endpoint does"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Settings */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-green-600" />
                Endpoint Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <FormLabel className="font-medium">Active</FormLabel>
                        <p className="text-sm text-gray-500">Enable this endpoint</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableCors"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <FormLabel className="font-medium">CORS</FormLabel>
                        <p className="text-sm text-gray-500">Enable cross-origin requests</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableLogging"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <FormLabel className="font-medium">Logging</FormLabel>
                        <p className="text-sm text-gray-500">Log requests and responses</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Advanced Configuration */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-purple-600" />
                Advanced Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="defaultPayload"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Payload (JSON)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder='{\n  "key": "value"\n}'
                          className="font-mono text-sm"
                          rows={8}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Used when no request body is provided
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customHeaders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Headers (JSON)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder='{\n  "Authorization": "Bearer token",\n  "X-Custom-Header": "value"\n}'
                          className="font-mono text-sm"
                          rows={8}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Additional headers to send with requests
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Updating..." : "Update Endpoint"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}