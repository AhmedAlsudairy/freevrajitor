"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock, DollarSign, Users, Calendar, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/client-auth-provider"
import { useToast } from "@/hooks/use-toast"

// Define Project type
type Project = {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  status: string;
  visibility: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  skills: string[];
  bids_count: number;
  client?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    rating?: number;
    reviews?: number;
  };
}

export default function ProjectsPage() {
  const { supabase } = useAuth();
  const { toast } = useToast();
  
  // State for projects and loading status
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [urgentProjects, setUrgentProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetMin, setBudgetMin] = useState<string>('');
  const [budgetMax, setBudgetMax] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // List of available skills
  const [availableSkills, setAvailableSkills] = useState<{id: string, name: string}[]>([]);
  
  // Fetch projects from Supabase
  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      setError(null);
      
      try {
        // First, fetch available skills for filters
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('id, name');
          
        if (skillsError) throw skillsError;
        setAvailableSkills(skillsData || []);
        
        // Fetch projects with their related data
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            *,
            client:client_id(id, profiles(id, full_name, avatar_url)),
            project_skills(skill_id, skill:skill_id(id, name)),
            bids(id)
          `)
          .eq('status', 'open') // Only show open projects
          .eq('visibility', 'public'); // Only show public projects
          
        if (projectsError) throw projectsError;
        
        if (projectsData) {
          // Format projects data
          const formattedProjects = projectsData.map(project => {
            return {
              id: project.id,
              title: project.title,
              description: project.description,
              budget_min: project.budget_min,
              budget_max: project.budget_max,
              deadline: project.deadline,
              status: project.status,
              visibility: project.visibility,
              created_at: project.created_at,
              updated_at: project.updated_at,
              client_id: project.client_id,
              // Format skills
              skills: project.project_skills?.map((ps: any) => ps.skill?.name) || [],
              // Count bids
              bids_count: project.bids?.length || 0,
              // Format client data
              client: project.client ? {
                id: project.client.id,
                full_name: project.client.profiles?.full_name || 'Anonymous',
                avatar_url: project.client.profiles?.avatar_url,
                // These would come from a ratings table in a real app
                rating: 4.8,
                reviews: 15
              } : undefined
            };
          });
          
          setProjects(formattedProjects);
          setFilteredProjects(formattedProjects);
          
          // Set featured projects (could be based on a featured flag in the database)
          setFeaturedProjects(formattedProjects.slice(0, 2));
          
          // Set urgent projects (could be based on deadline being close)
          const oneWeekFromNow = new Date();
          oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
          
          const urgentProjs = formattedProjects.filter(project => {
            const deadlineDate = new Date(project.deadline);
            return deadlineDate <= oneWeekFromNow;
          }).slice(0, 3);
          
          setUrgentProjects(urgentProjs);
        }
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load projects. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjects();
  }, [supabase, toast]);
  
  // Apply filters when filter values change
  useEffect(() => {
    if (projects.length === 0) return;
    
    let filtered = [...projects];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply budget min filter
    if (budgetMin) {
      const min = parseInt(budgetMin);
      filtered = filtered.filter(project => project.budget_max >= min);
    }
    
    // Apply budget max filter
    if (budgetMax) {
      const max = parseInt(budgetMax);
      filtered = filtered.filter(project => project.budget_min <= max);
    }
    
    // Apply skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(project => 
        selectedSkills.some(skill => 
          project.skills.some(projectSkill => 
            projectSkill.toLowerCase() === skill.toLowerCase()
          )
        )
      );
    }
    
    // Apply category filter (this would need a category field in your database)
    if (selectedCategory && selectedCategory !== 'all') {
      // This is a simplification; in a real app, you'd have a proper category field
      const categoryKeywords: Record<string, string[]> = {
        'web-development': ['web', 'website', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular'],
        'design': ['design', 'ui', 'ux', 'graphic', 'logo'],
        'writing': ['writing', 'content', 'blog', 'article', 'copywriting'],
        'marketing': ['marketing', 'seo', 'social media', 'advertising'],
        'photography': ['photography', 'photo', 'camera', 'portrait']
      };
      
      const keywords = categoryKeywords[selectedCategory] || [];
      
      filtered = filtered.filter(project => {
        return keywords.some(keyword => 
          project.title.toLowerCase().includes(keyword) ||
          project.description.toLowerCase().includes(keyword) ||
          project.skills.some(skill => skill.toLowerCase().includes(keyword))
        );
      });
    }
    
    // Apply sorting
    filtered = sortProjects(filtered, sortBy);
    
    setFilteredProjects(filtered);
  }, [searchQuery, budgetMin, budgetMax, selectedSkills, selectedCategory, sortBy, projects]);
  
  // Function to sort projects
  const sortProjects = (projects: Project[], sortType: string) => {
    switch (sortType) {
      case 'newest':
        return [...projects].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'budget-high':
        return [...projects].sort((a, b) => b.budget_max - a.budget_max);
      case 'budget-low':
        return [...projects].sort((a, b) => a.budget_min - b.budget_min);
      case 'bids':
        return [...projects].sort((a, b) => a.bids_count - b.bids_count);
      default:
        return projects;
    }
  };
  
  // Function to toggle skill selection
  const toggleSkillSelection = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  // Function to apply filters
  const handleApplyFilters = () => {
    // Filters are already applied via useEffect, this is just for the button
    toast({
      title: 'Filters Applied',
      description: 'Projects have been filtered based on your criteria.',
    });
  };
  
  // Calculate time ago for a timestamp
  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };
  
  // Calculate days until deadline
  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffInDays = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    return `Due in ${diffInDays} days`;
  };
  
  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Find Projects</h1>
          <p className="text-muted-foreground">Browse projects and submit your bids</p>
        </div>
        <Button asChild>
          <Link href="/projects/post">Post a Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search projects..." 
                      className="pl-8" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Category</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="design">Graphics & Design</SelectItem>
                      <SelectItem value="writing">Writing & Translation</SelectItem>
                      <SelectItem value="marketing">Digital Marketing</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Budget Range</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number"
                        placeholder="Min" 
                        className="pl-8" 
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number"
                        placeholder="Max" 
                        className="pl-8" 
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                      <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                      <SelectItem value="bids">Fewest Bids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Skills</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                    {availableSkills.length > 0 ? (
                      availableSkills.map((skill) => (
                        <div key={skill.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`skill-${skill.id}`} 
                            className="rounded border-gray-300" 
                            checked={selectedSkills.includes(skill.name)}
                            onChange={() => toggleSkillSelection(skill.name)}
                          />
                          <label htmlFor={`skill-${skill.id}`} className="text-sm">
                            {skill.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">Loading skills...</div>
                    )}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleApplyFilters}
                  disabled={isLoading}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Projects List */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/40 text-center">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Projects</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="urgent">Urgent</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="space-y-4">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      getTimeAgo={getTimeAgo}
                      getDaysUntilDeadline={getDaysUntilDeadline}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/40 text-center">
                    <p className="text-muted-foreground mb-4">No projects match your search criteria</p>
                    <Button onClick={() => {
                      setSearchQuery('');
                      setBudgetMin('');
                      setBudgetMax('');
                      setSelectedCategory('all');
                      setSelectedSkills([]);
                      setSortBy('newest');
                    }}>Clear Filters</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured" className="space-y-4">
                {featuredProjects.length > 0 ? (
                  featuredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      getTimeAgo={getTimeAgo}
                      getDaysUntilDeadline={getDaysUntilDeadline}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/40 text-center">
                    <p className="text-muted-foreground">No featured projects available at the moment</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="urgent" className="space-y-4">
                {urgentProjects.length > 0 ? (
                  urgentProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      getTimeAgo={getTimeAgo}
                      getDaysUntilDeadline={getDaysUntilDeadline}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/40 text-center">
                    <p className="text-muted-foreground">No urgent projects available at the moment</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}

interface ProjectCardProps {
  project: Project;
  getTimeAgo: (timestamp: string) => string;
  getDaysUntilDeadline: (deadline: string) => string;
}

function ProjectCard({ project, getTimeAgo, getDaysUntilDeadline }: ProjectCardProps) {
  // Format budget as range
  const formatBudget = () => {
    if (project.budget_min === project.budget_max) {
      return `$${project.budget_min}`;
    }
    return `$${project.budget_min} - $${project.budget_max}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                <Link href={`/projects/${project.id}`} className="hover:text-primary hover:underline">
                  {project.title}
                </Link>
              </h3>
            </div>

            <p className="text-muted-foreground line-clamp-2">{project.description}</p>

            <div className="flex flex-wrap gap-1">
              {project.skills.map((skill: string, index: number) => (
                <Badge key={`${skill}-${index}`} variant="secondary" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatBudget()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{project.bids_count} bid{project.bids_count !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{getDaysUntilDeadline(project.deadline)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Posted {getTimeAgo(project.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={project.client?.avatar_url || "/placeholder.svg?height=40&width=40"}
                alt={project.client?.full_name || "Client"}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <div className="text-sm font-medium">{project.client?.full_name || "Client"}</div>
                {project.client?.rating && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="text-yellow-500">★</span> {project.client.rating} ({project.client.reviews || 0})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3 flex justify-between">
        <div className="md:hidden flex items-center gap-2">
          <Image
            src={project.client?.avatar_url || "/placeholder.svg?height=24&width=24"}
            alt={project.client?.full_name || "Client"}
            width={24}
            height={24}
            className="rounded-full"
          />
          <div className="text-xs">{project.client?.full_name || "Client"}</div>
        </div>
        <Button asChild>
          <Link href={`/projects/${project.id}/bid`}>Bid Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
