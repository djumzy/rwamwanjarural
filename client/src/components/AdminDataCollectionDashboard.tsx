import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Users, Handshake, Calendar, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface NewsletterSubscription {
  id: number;
  email: string;
  name?: string;
  interests: string[];
  isActive: boolean;
  createdAt: string;
}

interface VolunteerApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string;
  availability: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface PartnershipApplication {
  id: number;
  applicantType: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  mission: string;
  vision: string;
  objectives: string;
  focusAreas: string;
  servicesOffered: string;
  servicesSought: string;
  partnershipReason: string;
  partnershipAreas: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminDataCollectionDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const { data: newsletters = [], isLoading: newslettersLoading } = useQuery({
    queryKey: ['/api/admin/newsletter-subscriptions'],
    enabled: true,
  });

  const { data: volunteers = [], isLoading: volunteersLoading } = useQuery({
    queryKey: ['/api/admin/volunteer-applications'],
    enabled: true,
  });

  const { data: partnerships = [], isLoading: partnershipsLoading } = useQuery({
    queryKey: ['/api/admin/partnership-applications'],
    enabled: true,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const stats = {
    totalNewsletterSubscriptions: newsletters.length,
    activeSubscriptions: newsletters.filter((n: NewsletterSubscription) => n.isActive).length,
    totalVolunteerApplications: volunteers.length,
    pendingVolunteers: volunteers.filter((v: VolunteerApplication) => v.status === 'pending').length,
    totalPartnershipApplications: partnerships.length,
    pendingPartnerships: partnerships.filter((p: PartnershipApplication) => p.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Collection Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage newsletter subscriptions, volunteer applications, and partnership requests</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="newsletters">Newsletter ({newsletters.length})</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers ({volunteers.length})</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships ({partnerships.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Newsletter Subscriptions</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalNewsletterSubscriptions}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeSubscriptions} active subscriptions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volunteer Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVolunteerApplications}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingVolunteers} pending review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partnership Applications</CardTitle>
                <Handshake className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPartnershipApplications}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingPartnerships} pending review
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="newsletters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscriptions</CardTitle>
              <CardDescription>Manage email newsletter subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {newslettersLoading ? (
                <div className="text-center py-4">Loading newsletter subscriptions...</div>
              ) : newsletters.length > 0 ? (
                <div className="space-y-4">
                  {newsletters.map((sub: NewsletterSubscription) => (
                    <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{sub.email}</div>
                        {sub.name && <div className="text-sm text-gray-600">{sub.name}</div>}
                        <div className="text-xs text-gray-500 mt-1">
                          Subscribed: {format(new Date(sub.createdAt), 'MMM d, yyyy')}
                        </div>
                        {sub.interests.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {sub.interests.map((interest, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{interest}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {sub.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No newsletter subscriptions yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Applications</CardTitle>
              <CardDescription>Review and manage volunteer applications</CardDescription>
            </CardHeader>
            <CardContent>
              {volunteersLoading ? (
                <div className="text-center py-4">Loading volunteer applications...</div>
              ) : volunteers.length > 0 ? (
                <div className="space-y-4">
                  {volunteers.map((vol: VolunteerApplication) => (
                    <div key={vol.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{vol.name}</h3>
                          <p className="text-sm text-gray-600">{vol.email} • {vol.phone}</p>
                          <p className="text-sm text-gray-600">{vol.location}</p>
                        </div>
                        {getStatusBadge(vol.status)}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div><strong>Skills:</strong> {vol.skills}</div>
                        <div><strong>Availability:</strong> {vol.availability}</div>
                        <div><strong>Motivation:</strong> {vol.motivation}</div>
                        <div className="text-xs text-gray-500">
                          Applied: {format(new Date(vol.createdAt), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No volunteer applications yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partnership Applications</CardTitle>
              <CardDescription>Review and manage partnership requests</CardDescription>
            </CardHeader>
            <CardContent>
              {partnershipsLoading ? (
                <div className="text-center py-4">Loading partnership applications...</div>
              ) : partnerships.length > 0 ? (
                <div className="space-y-4">
                  {partnerships.map((part: PartnershipApplication) => (
                    <div key={part.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{part.organizationName}</h3>
                          <p className="text-sm text-gray-600">{part.applicantType} • {part.contactPerson}</p>
                          <p className="text-sm text-gray-600">{part.email} • {part.phone}</p>
                          <p className="text-sm text-gray-600">{part.location}</p>
                        </div>
                        {getStatusBadge(part.status)}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div><strong>Mission:</strong> {part.mission}</div>
                        <div><strong>Vision:</strong> {part.vision}</div>
                        <div><strong>Objectives:</strong> {part.objectives}</div>
                        <div><strong>Focus Areas:</strong> {part.focusAreas}</div>
                        <div><strong>Services Offered:</strong> {part.servicesOffered}</div>
                        <div><strong>Services Sought:</strong> {part.servicesSought}</div>
                        <div><strong>Partnership Reason:</strong> {part.partnershipReason}</div>
                        {part.partnershipAreas.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            <strong>Partnership Areas:</strong>
                            {part.partnershipAreas.map((area, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs ml-1">{area}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          Applied: {format(new Date(part.createdAt), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No partnership applications yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}