import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Truck, Shield, Award, Headphones, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';
import medicapsLogo from '@/assets/medicaps-logo.png';

const features = [
  {
    icon: Truck,
    title: 'Campus Delivery',
    description: 'Free delivery to any campus location within 24 hours',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Premium fabrics & professional print quality guaranteed',
  },
  {
    icon: Award,
    title: 'Official Merchandise',
    description: 'Authorized Medicaps University licensed products',
  },
  {
    icon: Headphones,
    title: 'Student Support',
    description: 'Dedicated support team available for all your queries',
  },
];

const LandingPage = () => {
  const scrollToExplore = () => {
    document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page" style={{ minHeight: '100vh', background: 'hsl(var(--background))' }}>
      {/* ─── Top Navigation ─── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          background: 'hsla(228, 55%, 25%, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid hsla(0, 0%, 100%, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={medicapsLogo} alt="Medicaps University" style={{ height: '36px', width: 'auto' }} />
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.025em',
            }}
          >
            Campus Threads Co.
          </span>
        </div>

        <Link to="/login">
          <Button
            variant="outline"
            style={{
              borderColor: 'hsla(0, 0%, 100%, 0.3)',
              color: '#fff',
              background: 'hsla(0, 0%, 100%, 0.08)',
              fontWeight: 600,
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              transition: 'all 0.3s ease',
            }}
            className="landing-login-btn"
          >
            Login
          </Button>
        </Link>
      </nav>

      {/* ─── Hero Section ─── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src={heroBanner}
            alt="Campus Merchandise"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, hsla(228, 55%, 15%, 0.92) 0%, hsla(345, 70%, 25%, 0.88) 50%, hsla(228, 55%, 18%, 0.95) 100%)',
            }}
          />
        </div>

        {/* Decorative floating shapes */}
        <div
          className="landing-float-1"
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, hsla(38, 80%, 55%, 0.12), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="landing-float-2"
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, hsla(345, 70%, 45%, 0.15), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        {/* Hero Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '800px',
            padding: '0 1.5rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'hsla(0, 0%, 100%, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              marginBottom: '2rem',
              border: '1px solid hsla(0, 0%, 100%, 0.15)',
            }}
          >
            <Sparkles style={{ height: '16px', width: '16px', color: 'hsl(38, 80%, 55%)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsla(0, 0%, 100%, 0.9)' }}>
              Official Medicaps University Store
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            Wear Your
            <span
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, hsl(38, 80%, 55%), hsl(38, 90%, 65%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Campus Pride
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'hsla(0, 0%, 100%, 0.8)',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Premium quality merchandise for students, faculty, and clubs.
            Custom designs available for all university organizations.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
            }}
          >
            <Link to="/login">
              <Button
                size="lg"
                className="landing-cta-primary"
                style={{
                  background: 'linear-gradient(135deg, hsl(345, 70%, 38%), hsl(345, 70%, 28%))',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '0.875rem 2.25rem',
                  borderRadius: '9999px',
                  border: '1px solid hsla(345, 70%, 50%, 0.4)',
                  boxShadow: '0 8px 32px hsla(345, 70%, 30%, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started
                <ArrowRight style={{ height: '18px', width: '18px' }} />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              onClick={scrollToExplore}
              className="landing-cta-secondary"
              style={{
                borderColor: 'hsla(0, 0%, 100%, 0.25)',
                color: '#fff',
                background: 'hsla(0, 0%, 100%, 0.06)',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '0.875rem 2.25rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Compass style={{ height: '18px', width: '18px' }} />
              Explore
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToExplore}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'hsla(0, 0%, 100%, 0.5)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
          className="landing-bounce"
          aria-label="Scroll to explore"
        >
          <ChevronDown style={{ height: '28px', width: '28px' }} />
        </button>

        {/* Bottom fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to top, hsl(var(--background)), transparent)',
          }}
        />
      </section>

      {/* ─── Explore / Features Section ─── */}
      <section
        id="explore-section"
        style={{
          padding: '5rem 1.5rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'hsl(var(--foreground))',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Why Campus Threads?
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'hsl(var(--muted-foreground))',
              maxWidth: '550px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Everything you need for official campus merchandise, all in one place.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="landing-feature-card"
              style={{
                background: 'hsl(var(--card))',
                borderRadius: '1rem',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                border: '1px solid hsl(var(--border))',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, hsl(345, 70%, 32%), hsl(228, 55%, 25%))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  boxShadow: '0 4px 16px hsla(345, 70%, 30%, 0.25)',
                }}
              >
                <feature.icon style={{ height: '24px', width: '24px', color: '#fff' }} />
              </div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                  marginBottom: '0.5rem',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'hsl(var(--muted-foreground))',
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link to="/login">
            <Button
              size="lg"
              className="landing-cta-primary"
              style={{
                background: 'linear-gradient(135deg, hsl(345, 70%, 38%), hsl(228, 55%, 30%))',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0.875rem 2.5rem',
                borderRadius: '9999px',
                boxShadow: '0 8px 32px hsla(345, 70%, 30%, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
              }}
            >
              Start Shopping
              <ArrowRight style={{ height: '18px', width: '18px' }} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer
        style={{
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid hsl(var(--border))',
          color: 'hsl(var(--muted-foreground))',
          fontSize: '0.875rem',
        }}
      >
        © {new Date().getFullYear()} Campus Threads Co. — Medicaps University
      </footer>

      {/* ─── Animations ─── */}
      <style>{`
        .landing-login-btn:hover {
          background: hsla(0, 0%, 100%, 0.18) !important;
          border-color: hsla(0, 0%, 100%, 0.5) !important;
          transform: translateY(-1px);
        }

        .landing-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px hsla(345, 70%, 30%, 0.5) !important;
        }

        .landing-cta-secondary:hover {
          background: hsla(0, 0%, 100%, 0.14) !important;
          border-color: hsla(0, 0%, 100%, 0.4) !important;
          transform: translateY(-2px);
        }

        .landing-feature-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg) !important;
          border-color: hsl(345, 70%, 32%) !important;
        }

        @keyframes landing-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        .landing-bounce {
          animation: landing-bounce 2s ease-in-out infinite;
        }

        @keyframes landing-float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 15px); }
        }
        .landing-float-1 {
          animation: landing-float-1 8s ease-in-out infinite;
        }

        @keyframes landing-float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -20px); }
        }
        .landing-float-2 {
          animation: landing-float-2 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
