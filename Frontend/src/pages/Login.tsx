import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, GraduationCap, MapPin, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import medicapsLogo from '@/assets/medicaps-logo.png';
import { toast } from 'sonner';

export const Login = () => {
    const { loginStudent, registerStudent, loginAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Student login/register
    const [isRegister, setIsRegister] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Admin login
    const [adminKey, setAdminKey] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/home';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleStudentLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentEmail.trim() || !studentPassword.trim()) return;
        setIsLoading(true);
        try {
            await loginStudent(studentEmail.trim(), studentPassword);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStudentRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentName.trim() || !studentEmail.trim() || !studentPassword.trim()) return;
        if (studentPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (studentPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setIsLoading(true);
        try {
            await registerStudent(studentName.trim(), studentEmail.trim(), studentPassword);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminKey.trim()) return;
        try {
            loginAdmin(adminKey.trim());
        } catch {
            // Error handled by context toast
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <img src={medicapsLogo} alt="Medicaps University" className="h-16 w-auto mb-4" />
                    <h1 className="text-3xl font-bold text-center">Campus Threads Co.</h1>
                    <p className="text-muted-foreground flex items-center gap-1 mt-2">
                        <MapPin className="h-4 w-4" /> Medicaps University
                    </p>
                </div>

                <Card className="shadow-lg border-primary/10">
                    <Tabs defaultValue="student" className="w-full">
                        <CardHeader className="pb-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="student" className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" /> Student
                                </TabsTrigger>
                                <TabsTrigger value="admin" className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" /> Admin
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <CardContent>
                            {/* Student Login / Register */}
                            <TabsContent value="student" className="mt-0">
                                <CardDescription className="mb-4">
                                    {isRegister
                                        ? 'Create your account to start shopping on campus.'
                                        : 'Sign in to access the campus store, preview merch, and place orders.'}
                                </CardDescription>

                                <form onSubmit={isRegister ? handleStudentRegister : handleStudentLogin} className="space-y-4">
                                    {/* Name field - only for register */}
                                    {isRegister && (
                                        <div className="space-y-2">
                                            <Label htmlFor="sName">Full Name</Label>
                                            <Input
                                                id="sName"
                                                placeholder="John Doe"
                                                value={studentName}
                                                onChange={(e) => setStudentName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="sEmail">College Email</Label>
                                        <Input
                                            id="sEmail"
                                            type="email"
                                            placeholder="student@medicaps.ac.in"
                                            value={studentEmail}
                                            onChange={(e) => setStudentEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sPassword">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="sPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder={isRegister ? 'Min. 6 characters' : 'Enter your password'}
                                                value={studentPassword}
                                                onChange={(e) => setStudentPassword(e.target.value)}
                                                required
                                                minLength={isRegister ? 6 : undefined}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm password - only for register */}
                                    {isRegister && (
                                        <div className="space-y-2">
                                            <Label htmlFor="sConfirm">Confirm Password</Label>
                                            <Input
                                                id="sConfirm"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Re-enter your password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full font-medium mt-4 gap-2" disabled={isLoading}>
                                        {isLoading ? (
                                            'Please wait...'
                                        ) : isRegister ? (
                                            <><UserPlus className="h-4 w-4" /> Create Account</>
                                        ) : (
                                            <><LogIn className="h-4 w-4" /> Sign In</>
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsRegister(!isRegister);
                                            setStudentPassword('');
                                            setConfirmPassword('');
                                        }}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {isRegister
                                            ? 'Already have an account? Sign in'
                                            : "Don't have an account? Register"}
                                    </button>
                                </div>
                            </TabsContent>

                            {/* Admin Login */}
                            <TabsContent value="admin" className="mt-0">
                                <CardDescription className="mb-4">
                                    Staff and event organizers access. Enter the secure admin key.
                                </CardDescription>
                                <form onSubmit={handleAdminLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="aKey">Admin Password</Label>
                                        <Input
                                            id="aKey"
                                            type="password"
                                            placeholder="Enter admin key"
                                            value={adminKey}
                                            onChange={(e) => setAdminKey(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full font-medium mt-4">
                                        Access Admin Panel
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center">
                                        Demo key: admin123
                                    </p>
                                </form>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
};

export default Login;
