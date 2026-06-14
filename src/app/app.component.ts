import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <!-- Header -->
    <header class="ud-header">
      <div class="container">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="#">
            <i class="fas fa-microphone-alt" style="font-size: 28px; color: var(--primary);"></i>
            <span style="font-weight: 700; font-size: 24px; margin-left: 10px;">Awaaz AI</span>
          </a>
          <button class="navbar-toggler" type="button" (click)="toggleNavbar()">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" [class.show]="navbarOpen">
            <ul class="navbar-nav mx-auto">
              <li class="nav-item"><a class="nav-link" href="#home" (click)="scrollTo('home')">Home</a></li>
              <li class="nav-item"><a class="nav-link" href="#features" (click)="scrollTo('features')">Features</a></li>
              <li class="nav-item"><a class="nav-link" href="#demo" (click)="scrollTo('demo')">Demo Studio</a></li>
              <li class="nav-item"><a class="nav-link" href="#pricing" (click)="scrollTo('pricing')">Pricing</a></li>
              <li class="nav-item"><a class="nav-link" href="#contact" (click)="scrollTo('contact')">Contact</a></li>
            </ul>
          </div>
          <div class="navbar-btn d-none d-sm-inline-block">
            <a href="#demo" class="ud-main-btn ud-primary-btn" (click)="scrollTo('demo')">Try Free Demo</a>
          </div>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="ud-hero" id="home">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7" data-aos="fade-right">
            <div class="ud-hero-content">
              <h1 class="ud-hero-title">
                Awaaz AI Suite: <br>
                <span class="gradient-text">
                  TTS, Voice Cloning & Emotion AI
                </span>
              </h1>
              <p class="ud-hero-desc">
                Transform your voice with cutting-edge AI technology. Generate natural speech,
                clone voices, and express emotions in 12 different styles.
              </p>
              <div class="ud-hero-buttons">
                <a href="#demo" class="ud-main-btn ud-primary-btn me-3" (click)="scrollTo('demo')">Start Creating Free</a>
                <a href="#features" class="ud-main-btn ud-outline-btn" (click)="scrollTo('features')">Explore Features</a>
              </div>
            </div>
          </div>
          <div class="col-lg-5" data-aos="fade-left">
            <div class="ud-hero-image text-center float-animation">
              <i class="fas fa-head-side-vr" style="font-size: 200px; color: rgba(255,255,255,0.2);"></i>
              <i class="fas fa-microphone-alt" style="font-size: 80px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white;"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="ud-features">
      <div class="container">
        <div class="ud-section-title" data-aos="fade-up">
          <span>What We Offer</span>
          <h2>Complete Voice AI Platform</h2>
          <p>All the tools you need to work with voice AI in one place</p>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6" *ngFor="let feature of features; let i = index" data-aos="fade-up" [attr.data-aos-delay]="(i + 1) * 100">
            <div class="ud-single-feature" (click)="scrollToDemo(feature.type)">
              <div class="ud-feature-icon"><i [class]="feature.icon"></i></div>
              <h3 class="ud-feature-title">{{feature.title}}</h3>
              <p>{{feature.description}}</p>
              <span class="badge bg-primary mt-3">{{feature.badge}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Studio Section -->
    <section id="demo" class="demo-section">
      <div class="container">
        <div class="ud-section-title" data-aos="fade-up">
          <span>Interactive Demo</span>
          <h2>Try Awaaz AI in Action</h2>
          <p>Experience the power of our voice technology - it's free!</p>
        </div>

        <!-- Card 1: Simple TTS with Speaker List -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-volume-up me-2"></i>Simple Text-to-Speech</h3>
          
          <div class="row">
            <div class="col-md-12">
              <label class="form-label fw-bold">Enter Text:</label>
              <textarea [(ngModel)]="simpleTtsText" rows="3" class="form-control" placeholder="Enter your text here..."></textarea>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">Language:</label>
              <select [(ngModel)]="simpleTtsLanguage" (change)="onSimpleLanguageChange()" class="form-control">
                <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Select Speaker ({{getLanguageName(simpleTtsLanguage)}}):</label>
              <div class="speaker-list">
                <div *ngFor="let speaker of getFilteredSpeakers(simpleTtsLanguage)" 
                     class="speaker-chip" 
                     [class.active]="selectedSimpleSpeaker === speaker.name"
                     (click)="selectSimpleSpeaker(speaker.name)">
                  <i class="fas fa-user-circle"></i>
                  <span>{{speaker.name}}</span>
                  <span class="language-badge">{{speaker.language}}</span>
                </div>
                <div *ngIf="isLoadingSpeakers" class="text-muted">Loading speakers...</div>
                <div *ngIf="!isLoadingSpeakers && getFilteredSpeakers(simpleTtsLanguage).length === 0" class="text-muted">
                  No {{getLanguageName(simpleTtsLanguage)}} speakers found. 
                  <a href="javascript:void(0)" (click)="scrollTo('clone-card')">Upload a {{getLanguageName(simpleTtsLanguage)}} speaker</a>
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <button class="ud-main-btn ud-primary-btn w-100" (click)="generateSimpleTTS()" [disabled]="isGeneratingSimple">
                <i class="fas" [class.fa-spinner]="isGeneratingSimple" [class.fa-play]="!isGeneratingSimple"></i>
                {{isGeneratingSimple ? 'Generating...' : 'Generate Speech'}}
              </button>
            </div>
          </div>

          <div class="mt-3" *ngIf="simpleTtsStatus">
            <div class="alert" [class.alert-success]="simpleTtsStatus.includes('success')" 
                 [class.alert-danger]="simpleTtsStatus.includes('failed')">
              {{simpleTtsStatus}}
            </div>
          </div>

          <div class="mt-3" *ngIf="simpleTtsAudioUrl">
            <audio controls class="w-100">
              <source [src]="simpleTtsAudioUrl" type="audio/wav">
            </audio>
            <button class="btn btn-sm btn-outline-primary mt-2" (click)="downloadSimpleAudio()">
              <i class="fas fa-download me-1"></i>Download Audio
            </button>
          </div>
        </div>

        <!-- Card 2: Emotion TTS -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-smile me-2"></i>Emotional Text-to-Speech</h3>
          
          <div class="row">
            <div class="col-md-12">
              <label class="form-label fw-bold">Enter Text:</label>
              <textarea [(ngModel)]="emotionTtsText" rows="3" class="form-control" placeholder="Enter your text here..."></textarea>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-4">
              <label class="form-label fw-bold">Language:</label>
              <select [(ngModel)]="emotionTtsLanguage" (change)="onEmotionLanguageChange()" class="form-control">
                <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
              </select>
            </div>
            <div class="col-md-8">
              <label class="form-label fw-bold">Select Speaker ({{getLanguageName(emotionTtsLanguage)}}):</label>
              <div class="speaker-list">
                <div *ngFor="let speaker of getFilteredSpeakers(emotionTtsLanguage)" 
                     class="speaker-chip" 
                     [class.active]="selectedEmotionSpeaker === speaker.name"
                     (click)="selectEmotionSpeaker(speaker.name)">
                  <i class="fas fa-user-circle"></i>
                  <span>{{speaker.name}}</span>
                </div>
                <div *ngIf="getFilteredSpeakers(emotionTtsLanguage).length === 0" class="text-muted">
                  No {{getLanguageName(emotionTtsLanguage)}} speakers available
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <label class="form-label fw-bold">Select Emotion:</label>
              <div class="emotion-grid">
                <div *ngFor="let emotion of emotions" 
                     class="emotion-card" 
                     [class.active]="selectedEmotion === emotion.id"
                     (click)="selectEmotion(emotion.id)">
                  <span class="emotion-emoji">{{emotion.emoji}}</span>
                  <span class="emotion-name">{{emotion.name}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">Speed (0.5 - 2.0):</label>
              <input type="range" [(ngModel)]="emotionSpeed" min="0.5" max="2.0" step="0.1" class="form-range">
              <span class="badge bg-secondary">{{emotionSpeed}}</span>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Pitch (0.5 - 2.0):</label>
              <input type="range" [(ngModel)]="emotionPitch" min="0.5" max="2.0" step="0.1" class="form-range">
              <span class="badge bg-secondary">{{emotionPitch}}</span>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <button class="ud-main-btn ud-primary-btn w-100" (click)="generateEmotionTTS()" [disabled]="isGeneratingEmotion">
                <i class="fas" [class.fa-spinner]="isGeneratingEmotion" [class.fa-smile]="!isGeneratingEmotion"></i>
                {{isGeneratingEmotion ? 'Generating...' : 'Generate Emotional Speech'}}
              </button>
            </div>
          </div>

          <div class="mt-3" *ngIf="emotionTtsStatus">
            <div class="alert" [class.alert-success]="emotionTtsStatus.includes('success')" 
                 [class.alert-danger]="emotionTtsStatus.includes('failed')">
              {{emotionTtsStatus}}
            </div>
          </div>

          <div class="mt-3" *ngIf="emotionTtsAudioUrl">
            <audio controls class="w-100">
              <source [src]="emotionTtsAudioUrl" type="audio/wav">
            </audio>
            <button class="btn btn-sm btn-outline-primary mt-2" (click)="downloadEmotionAudio()">
              <i class="fas fa-download me-1"></i>Download Audio
            </button>
          </div>
        </div>

        <!-- Card 3: Voice Cloning (Upload & Use) -->
        <div class="demo-card mb-4" id="clone-card" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-clone me-2"></i>Voice Cloning Studio</h3>
          
          <div class="row">
            <div class="col-md-6">
              <div class="cloning-upload-area" (click)="triggerFileUpload()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: var(--primary);"></i>
                <p>Upload a voice sample to create a new speaker</p>
                <small class="text-muted">10-30 seconds recommended (WAV/MP3)</small>
                <input type="file" #fileInput accept="audio/*" (change)="onFileSelected($event)" style="display: none;">
              </div>
              
              <div class="mt-3" *ngIf="selectedFileName">
                <div class="alert alert-info">
                  <i class="fas fa-file-audio me-2"></i>
                  File: {{selectedFileName}}
                </div>
              </div>

              <div class="mt-3">
                <label class="form-label fw-bold">Speaker Name:</label>
                <input type="text" [(ngModel)]="newSpeakerName" class="form-control" placeholder="Enter a name for this speaker (e.g., john, sarah)">
                
                <label class="form-label fw-bold mt-2">Speaker Language:</label>
                <select [(ngModel)]="newSpeakerLanguage" class="form-control">
                  <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
                </select>
                
                <button class="btn btn-sm btn-outline-primary mt-2 w-100" (click)="uploadSpeaker()" [disabled]="isUploading">
                  <i class="fas" [class.fa-spinner]="isUploading" [class.fa-upload]="!isUploading"></i>
                  {{isUploading ? 'Uploading...' : 'Upload Speaker'}}
                </button>
              </div>

              <div class="mt-3" *ngIf="uploadStatus">
                <div class="alert" [class.alert-success]="uploadStatus.includes('success')" 
                     [class.alert-danger]="uploadStatus.includes('failed')">
                  {{uploadStatus}}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold">Language:</label>
              <select [(ngModel)]="cloneLanguage" (change)="onCloneLanguageChange()" class="form-control">
                <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
              </select>

              <label class="form-label fw-bold mt-2">Select Cloned Speaker ({{getLanguageName(cloneLanguage)}}):</label>
              <div class="speaker-list">
                <div *ngFor="let speaker of getFilteredSpeakers(cloneLanguage)" 
                     class="speaker-chip" 
                     [class.active]="selectedCloneSpeaker === speaker.name"
                     (click)="selectCloneSpeaker(speaker.name)">
                  <i class="fas fa-user-circle"></i>
                  <span>{{speaker.name}}</span>
                </div>
                <div *ngIf="getFilteredSpeakers(cloneLanguage).length === 0" class="text-muted">
                  No {{getLanguageName(cloneLanguage)}} speakers found. Upload one first!
                </div>
              </div>

              <div class="mt-3">
                <label class="form-label fw-bold">Text to Speak:</label>
                <textarea [(ngModel)]="cloneText" rows="2" class="form-control" placeholder="Enter text to speak in cloned voice..."></textarea>
              </div>

              <button class="ud-main-btn ud-primary-btn w-100 mt-3" (click)="generateCloneTTS()" [disabled]="isCloning">
                <i class="fas" [class.fa-spinner]="isCloning" [class.fa-magic]="!isCloning"></i>
                {{isCloning ? 'Generating...' : 'Generate with Cloned Voice'}}
              </button>

              <div class="mt-3" *ngIf="cloneStatus" [innerHTML]="cloneStatus"></div>
              <div class="mt-3" *ngIf="cloneAudioUrl">
                <audio controls class="w-100">
                  <source [src]="cloneAudioUrl" type="audio/wav">
                </audio>
                <button class="btn btn-sm btn-outline-primary mt-2 w-100" (click)="downloadCloneAudio()">
                  <i class="fas fa-download me-1"></i>Download Audio
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4: Temporary Voice (No upload needed) -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-bolt me-2"></i>Quick Test - Temporary Voice</h3>
          
          <div class="row">
            <div class="col-md-12">
              <label class="form-label fw-bold">Text to Speak:</label>
              <textarea [(ngModel)]="tempText" rows="3" class="form-control" placeholder="Enter text..."></textarea>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">Language:</label>
              <select [(ngModel)]="tempLanguage" class="form-control">
                <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Upload Temporary Voice:</label>
              <input type="file" (change)="onTempFileSelected($event)" accept="audio/*" class="form-control">
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <button class="ud-main-btn ud-primary-btn w-100" (click)="generateTempTTS()" [disabled]="isGeneratingTemp">
                <i class="fas" [class.fa-spinner]="isGeneratingTemp" [class.fa-microphone]="!isGeneratingTemp"></i>
                {{isGeneratingTemp ? 'Generating...' : 'Generate with Temporary Voice'}}
              </button>
            </div>
          </div>

          <div class="mt-3" *ngIf="tempStatus">
            <div class="alert" [class.alert-success]="tempStatus.includes('success')" 
                 [class.alert-danger]="tempStatus.includes('failed')">
              {{tempStatus}}
            </div>
          </div>

          <div class="mt-3" *ngIf="tempAudioUrl">
            <audio controls class="w-100">
              <source [src]="tempAudioUrl" type="audio/wav">
            </audio>
            <button class="btn btn-sm btn-outline-primary mt-2" (click)="downloadTempAudio()">
              <i class="fas fa-download me-1"></i>Download Audio
            </button>
          </div>
        </div>

        <!-- STT Demo -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-microphone me-2"></i>Speech-to-Text Transcriber</h3>
          <div class="row">
            <div class="col-md-6">
              <button class="ud-main-btn ud-secondary-btn w-100 mb-3" (click)="toggleRecording()">
                <i class="fas fa-circle me-2"></i>{{isRecording ? 'Stop Recording' : 'Start Recording'}}
              </button>
            </div>
            <div class="col-md-6">
              <textarea [(ngModel)]="sttResult" rows="4" class="form-control" placeholder="Transcribed text will appear here..." readonly></textarea>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="ud-pricing">
      <div class="container">
        <div class="ud-section-title" data-aos="fade-up">
          <span>Pricing</span>
          <h2>Choose Your Plan</h2>
          <p>Flexible plans for every need - from creators to enterprises</p>
        </div>
        <div class="row">
          <div class="col-lg-4" *ngFor="let plan of pricingPlans; let i = index" data-aos="fade-up" [attr.data-aos-delay]="(i + 1) * 100">
            <div class="ud-single-pricing" [class.active]="plan.popular">
              <span class="ud-popular-tag" *ngIf="plan.popular">POPULAR</span>
              <h3>{{plan.name}}</h3>
              <h2>{{plan.price}}</h2>
              <p *ngIf="plan.period">{{plan.period}}</p>
              <ul class="list-unstyled mt-4">
                <li *ngFor="let feature of plan.features">✓ {{feature}}</li>
              </ul>
              <a [href]="plan.link" class="ud-main-btn" [class.ud-primary-btn]="plan.popular" [class.ud-outline-btn]="!plan.popular" (click)="scrollTo('demo')">Get Started</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="demo-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-6" data-aos="fade-right">
            <h2>Ready to transform your voice experience?</h2>
            <p class="mt-3">Join thousands of creators, developers, and businesses using Awaaz AI.</p>
            <div class="mt-4">
              <div class="d-flex align-items-center mb-3">
                <i class="fas fa-check-circle text-primary me-3 fs-4"></i>
                <span>Enterprise-grade security</span>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="fas fa-check-circle text-primary me-3 fs-4"></i>
                <span>99.9% uptime guarantee</span>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="fas fa-check-circle text-primary me-3 fs-4"></i>
                <span>24/7 technical support</span>
              </div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <div class="demo-card">
              <h3>Get in Touch</h3>
              <form (ngSubmit)="sendMessage()">
                <input type="text" [(ngModel)]="contactName" name="name" class="form-control mb-3" placeholder="Your Name" required>
                <input type="email" [(ngModel)]="contactEmail" name="email" class="form-control mb-3" placeholder="Email Address" required>
                <textarea rows="3" [(ngModel)]="contactMessage" name="message" class="form-control mb-3" placeholder="Message" required></textarea>
                <button type="submit" class="ud-main-btn ud-primary-btn w-100">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="ud-footer">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <i class="fas fa-microphone-alt fs-1 mb-3"></i>
            <p>Awaaz AI - Complete Voice AI Platform for creators and businesses.</p>
          </div>
          <div class="col-lg-2">
            <h5>Product</h5>
            <ul class="list-unstyled">
              <li><a href="#features" class="text-white-50 text-decoration-none" (click)="scrollTo('features')">Features</a></li>
              <li><a href="#pricing" class="text-white-50 text-decoration-none" (click)="scrollTo('pricing')">Pricing</a></li>
              <li><a href="#demo" class="text-white-50 text-decoration-none" (click)="scrollTo('demo')">Demo</a></li>
            </ul>
          </div>
          <div class="col-lg-2">
            <h5>Resources</h5>
            <ul class="list-unstyled">
              <li><a href="#" class="text-white-50 text-decoration-none">Documentation</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none">API Reference</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none">Blog</a></li>
            </ul>
          </div>
          <div class="col-lg-4">
            <h5>Subscribe to Newsletter</h5>
            <div class="input-group">
              <input type="email" [(ngModel)]="newsletterEmail" class="form-control" placeholder="Your email">
              <button class="btn btn-primary" (click)="subscribeNewsletter()">Subscribe</button>
            </div>
          </div>
        </div>
        <hr class="mt-4">
        <div class="text-center">
          <p class="mb-0">© 2024 Awaaz AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navbarOpen = false;
  
  // API Configuration
  private readonly API_URL = 'https://shkahmed-backend.hf.space';
  
  features = [
    { icon: 'fas fa-volume-up', title: 'Text-to-Speech (TTS)', description: 'Convert any text into natural speech with multiple voices.', badge: '5+ Voices', type: 'tts' },
    { icon: 'fas fa-clone', title: 'Voice Cloning', description: 'Clone any voice with just 10 seconds of audio.', badge: '10s Sample', type: 'cloning' },
    { icon: 'fas fa-smile', title: 'Emotion TTS', description: 'Generate speech with 12 different emotions.', badge: '12 Emotions', type: 'emotion' },
    { icon: 'fas fa-microphone', title: 'Speech-to-Text', description: 'Transcribe audio with high accuracy.', badge: '98% Accuracy', type: 'stt' },
    { icon: 'fas fa-bolt', title: 'Temporary Voice', description: 'Test with any voice without saving.', badge: 'Instant', type: 'temp' }
  ];

  // Emotions
  emotions = [
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'sad', name: 'Sad', emoji: '😢' },
    { id: 'angry', name: 'Angry', emoji: '😠' },
    { id: 'excited', name: 'Excited', emoji: '🤩' },
    { id: 'calm', name: 'Calm', emoji: '😌' },
    { id: 'fearful', name: 'Fearful', emoji: '😨' },
    { id: 'surprised', name: 'Surprised', emoji: '😲' },
    { id: 'neutral', name: 'Neutral', emoji: '😐' },
    { id: 'friendly', name: 'Friendly', emoji: '🤝' },
    { id: 'authoritative', name: 'Authoritative', emoji: '👔' },
    { id: 'whisper', name: 'Whisper', emoji: '🤫' },
    { id: 'narrative', name: 'Narrative', emoji: '📖' }
  ];

  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' }
  ];

  pricingPlans = [
    { name: 'Free', price: '$0', period: '/month', features: ['10 minutes TTS/month', 'Basic voices', 'Community support'], popular: false, link: '#demo' },
    { name: 'Pro', price: '$19', period: '/month', features: ['500 minutes TTS', 'Voice cloning', 'All emotions', 'Priority support'], popular: true, link: '#demo' },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited usage', 'Custom voice training', 'Dedicated support'], popular: false, link: '#contact' }
  ];

  // Speaker List with language info
  speakerList: { name: string; language: string; languageName: string }[] = [];
  isLoadingSpeakers = false;

  // Card 1: Simple TTS
  simpleTtsText = "Oh yes, the deep sea: nature's basement. Home to creatures so bizarre, even nightmares are like 'Nah, I'll pass.'";
  selectedSimpleSpeaker = '';
  simpleTtsLanguage = 'en';
  isGeneratingSimple = false;
  simpleTtsStatus = '';
  simpleTtsAudioUrl: string | null = null;
  simpleTtsAudioBlob: Blob | null = null;

  // Card 2: Emotion TTS
  emotionTtsText = "I am so excited to see you today!";
  selectedEmotionSpeaker = '';
  selectedEmotion = 'happy';
  emotionTtsLanguage = 'en';
  emotionSpeed = 1.0;
  emotionPitch = 1.0;
  isGeneratingEmotion = false;
  emotionTtsStatus = '';
  emotionTtsAudioUrl: string | null = null;
  emotionTtsAudioBlob: Blob | null = null;

  // Card 3: Voice Cloning
  newSpeakerName = '';
  newSpeakerLanguage = 'en';
  selectedCloneSpeaker = '';
  cloneText = 'Hello, this is my cloned voice. Amazing, isn\'t it?';
  cloneLanguage = 'en';
  isUploading = false;
  isCloning = false;
  uploadStatus = '';
  cloneStatus = '';
  cloneAudioUrl: string | null = null;
  cloneAudioBlob: Blob | null = null;
  selectedFile: File | null = null;
  selectedFileName = '';

  // Card 4: Temporary TTS
  tempText = 'This is a quick test with a temporary voice.';
  tempLanguage = 'en';
  tempFile: File | null = null;
  isGeneratingTemp = false;
  tempStatus = '';
  tempAudioUrl: string | null = null;
  tempAudioBlob: Blob | null = null;

  // STT Properties
  isRecording = false;
  sttResult = '';
  mediaRecorder: any;
  audioChunks: any[] = [];

  // Contact Properties
  contactName = '';
  contactEmail = '';
  contactMessage = '';
  newsletterEmail = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    import('aos').then(AOS => {
      AOS.init({ duration: 800, once: true });
    });
    this.loadSpeakers();
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.navbarOpen = false;
    }
  }

  scrollToDemo(type: string) {
    this.scrollTo('demo');
  }

  getLanguageName(langCode: string): string {
    const lang = this.languages.find(l => l.code === langCode);
    return lang ? lang.name : 'Unknown';
  }

  // Filter speakers by language
  getFilteredSpeakers(languageCode: string) {
    return this.speakerList.filter(speaker => speaker.language === languageCode);
  }

  // Load speakers from API (only GET /speakers/list)
  async loadSpeakers() {
    this.isLoadingSpeakers = true;
    try {
      const response: any = await this.http.get(`${this.API_URL}/speakers/list`).toPromise();
      if (response && response.speakers) {
        this.speakerList = Object.keys(response.speakers).map(name => ({
          name: name,
          language: response.speakers[name].language || 'en',
          languageName: response.speakers[name].language_name || 'English'
        }));
        
        // Auto-select first speaker for each language
        this.updateDefaultSelections();
      }
    } catch (error) {
      console.error('Failed to load speakers:', error);
    } finally {
      this.isLoadingSpeakers = false;
    }
  }

  updateDefaultSelections() {
    // Set default speakers for current languages
    const englishSpeakers = this.getFilteredSpeakers('en');
    const hindiSpeakers = this.getFilteredSpeakers('hi');
    
    if (this.simpleTtsLanguage === 'en' && englishSpeakers.length > 0 && !this.selectedSimpleSpeaker) {
      this.selectedSimpleSpeaker = englishSpeakers[0].name;
    } else if (this.simpleTtsLanguage === 'hi' && hindiSpeakers.length > 0 && !this.selectedSimpleSpeaker) {
      this.selectedSimpleSpeaker = hindiSpeakers[0].name;
    }
    
    if (this.emotionTtsLanguage === 'en' && englishSpeakers.length > 0 && !this.selectedEmotionSpeaker) {
      this.selectedEmotionSpeaker = englishSpeakers[0].name;
    } else if (this.emotionTtsLanguage === 'hi' && hindiSpeakers.length > 0 && !this.selectedEmotionSpeaker) {
      this.selectedEmotionSpeaker = hindiSpeakers[0].name;
    }
    
    if (this.cloneLanguage === 'en' && englishSpeakers.length > 0 && !this.selectedCloneSpeaker) {
      this.selectedCloneSpeaker = englishSpeakers[0].name;
    } else if (this.cloneLanguage === 'hi' && hindiSpeakers.length > 0 && !this.selectedCloneSpeaker) {
      this.selectedCloneSpeaker = hindiSpeakers[0].name;
    }
  }

  onSimpleLanguageChange() {
    // Reset selected speaker when language changes
    const speakers = this.getFilteredSpeakers(this.simpleTtsLanguage);
    if (speakers.length > 0) {
      this.selectedSimpleSpeaker = speakers[0].name;
    } else {
      this.selectedSimpleSpeaker = '';
    }
  }

  onEmotionLanguageChange() {
    const speakers = this.getFilteredSpeakers(this.emotionTtsLanguage);
    if (speakers.length > 0) {
      this.selectedEmotionSpeaker = speakers[0].name;
    } else {
      this.selectedEmotionSpeaker = '';
    }
  }

  onCloneLanguageChange() {
    const speakers = this.getFilteredSpeakers(this.cloneLanguage);
    if (speakers.length > 0) {
      this.selectedCloneSpeaker = speakers[0].name;
    } else {
      this.selectedCloneSpeaker = '';
    }
  }

  selectSimpleSpeaker(speakerName: string) {
    this.selectedSimpleSpeaker = speakerName;
  }

  selectEmotionSpeaker(speakerName: string) {
    this.selectedEmotionSpeaker = speakerName;
  }

  selectCloneSpeaker(speakerName: string) {
    this.selectedCloneSpeaker = speakerName;
  }

  selectEmotion(emotionId: string) {
    this.selectedEmotion = emotionId;
  }

  // Card 1: Simple TTS (POST /synthesize)
  async generateSimpleTTS() {
    if (!this.simpleTtsText.trim()) {
      alert('Please enter some text');
      return;
    }
    if (!this.selectedSimpleSpeaker) {
      alert(`Please select a ${this.getLanguageName(this.simpleTtsLanguage)} speaker`);
      return;
    }

    this.isGeneratingSimple = true;
    this.simpleTtsStatus = 'Generating speech...';

    try {
      const formData = new FormData();
      formData.append('text', this.simpleTtsText);
      formData.append('language', this.simpleTtsLanguage);
      formData.append('speaker_name', this.selectedSimpleSpeaker);

      const response = await this.http.post(`${this.API_URL}/synthesize`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.simpleTtsAudioBlob = response.body;
        this.simpleTtsAudioUrl = URL.createObjectURL(this.simpleTtsAudioBlob);
        this.simpleTtsStatus = 'Audio generated successfully!';
        
        const audio = new Audio(this.simpleTtsAudioUrl);
        audio.play();
      }
    } catch (error: any) {
      console.error('Simple TTS Error:', error);
      this.simpleTtsStatus = `Generation failed: ${error.message}`;
    } finally {
      this.isGeneratingSimple = false;
    }
  }

  downloadSimpleAudio() {
    if (this.simpleTtsAudioBlob && this.simpleTtsAudioUrl) {
      const a = document.createElement('a');
      a.href = this.simpleTtsAudioUrl;
      a.download = `simple_tts_${Date.now()}.wav`;
      a.click();
    }
  }

  // Card 2: Emotion TTS (POST /synthesize-with-emotion)
  async generateEmotionTTS() {
    if (!this.emotionTtsText.trim()) {
      alert('Please enter some text');
      return;
    }
    if (!this.selectedEmotionSpeaker) {
      alert(`Please select a ${this.getLanguageName(this.emotionTtsLanguage)} speaker`);
      return;
    }

    this.isGeneratingEmotion = true;
    this.emotionTtsStatus = 'Generating emotional speech...';

    try {
      const formData = new FormData();
      formData.append('text', this.emotionTtsText);
      formData.append('language', this.emotionTtsLanguage);
      formData.append('emotion', this.selectedEmotion);
      formData.append('speaker_name', this.selectedEmotionSpeaker);
      formData.append('speed', this.emotionSpeed.toString());
      formData.append('pitch', this.emotionPitch.toString());

      const response = await this.http.post(`${this.API_URL}/synthesize-with-emotion`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.emotionTtsAudioBlob = response.body;
        this.emotionTtsAudioUrl = URL.createObjectURL(this.emotionTtsAudioBlob);
        this.emotionTtsStatus = 'Emotional audio generated successfully!';
        
        const audio = new Audio(this.emotionTtsAudioUrl);
        audio.play();
      }
    } catch (error: any) {
      console.error('Emotion TTS Error:', error);
      this.emotionTtsStatus = `Generation failed: ${error.message}`;
    } finally {
      this.isGeneratingEmotion = false;
    }
  }

  downloadEmotionAudio() {
    if (this.emotionTtsAudioBlob && this.emotionTtsAudioUrl) {
      const a = document.createElement('a');
      a.href = this.emotionTtsAudioUrl;
      a.download = `emotion_tts_${Date.now()}.wav`;
      a.click();
    }
  }

  // Card 3: Voice Cloning (POST /speakers/upload and POST /synthesize)
  triggerFileUpload() {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.selectedFile = files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile?.name || '';
  }

  async uploadSpeaker() {
    if (!this.selectedFile) {
      alert('Please select a voice file first');
      return;
    }
    if (!this.newSpeakerName.trim()) {
      alert('Please enter a speaker name');
      return;
    }

    this.isUploading = true;
    this.uploadStatus = 'Uploading speaker...';

    try {
      const formData = new FormData();
      formData.append('speaker_name', this.newSpeakerName);
      formData.append('speaker_wav', this.selectedFile);
      formData.append('language', this.newSpeakerLanguage);
      formData.append('description', `Uploaded via UI - ${this.getLanguageName(this.newSpeakerLanguage)} voice`);

      const response: any = await this.http.post(`${this.API_URL}/speakers/upload`, formData).toPromise();
      
      if (response && response.status === 'success') {
        this.uploadStatus = `Speaker uploaded successfully with ${this.getLanguageName(this.newSpeakerLanguage)} language!`;
        this.newSpeakerName = '';
        this.selectedFile = null;
        this.selectedFileName = '';
        await this.loadSpeakers();
        
        // Auto-select the new speaker if language matches current selection
        if (this.simpleTtsLanguage === this.newSpeakerLanguage) {
          this.onSimpleLanguageChange();
        }
        if (this.emotionTtsLanguage === this.newSpeakerLanguage) {
          this.onEmotionLanguageChange();
        }
        if (this.cloneLanguage === this.newSpeakerLanguage) {
          this.onCloneLanguageChange();
        }
        
        setTimeout(() => {
          this.uploadStatus = '';
        }, 3000);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      this.uploadStatus = `Upload failed: ${error.message}`;
    } finally {
      this.isUploading = false;
    }
  }

  async generateCloneTTS() {
    if (!this.cloneText.trim()) {
      alert('Please enter text to speak');
      return;
    }
    if (!this.selectedCloneSpeaker) {
      alert(`Please select a ${this.getLanguageName(this.cloneLanguage)} speaker`);
      return;
    }

    this.isCloning = true;
    this.cloneStatus = '<div class="alert alert-info">Generating speech with cloned voice...</div>';

    try {
      const formData = new FormData();
      formData.append('text', this.cloneText);
      formData.append('language', this.cloneLanguage);
      formData.append('speaker_name', this.selectedCloneSpeaker);

      const response = await this.http.post(`${this.API_URL}/synthesize`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.cloneAudioBlob = response.body;
        this.cloneAudioUrl = URL.createObjectURL(this.cloneAudioBlob);
        this.cloneStatus = '<div class="alert alert-success">Audio generated successfully!</div>';
        
        const audio = new Audio(this.cloneAudioUrl);
        audio.play();
      }
    } catch (error: any) {
      console.error('Clone TTS Error:', error);
      this.cloneStatus = `<div class="alert alert-danger">Generation failed: ${error.message}</div>`;
    } finally {
      this.isCloning = false;
    }
  }

  downloadCloneAudio() {
    if (this.cloneAudioBlob && this.cloneAudioUrl) {
      const a = document.createElement('a');
      a.href = this.cloneAudioUrl;
      a.download = `cloned_tts_${Date.now()}.wav`;
      a.click();
    }
  }

  // Card 4: Temporary TTS (POST /synthesize-temp)
  onTempFileSelected(event: any) {
    this.tempFile = event.target.files[0];
    if (this.tempFile) {
      this.tempStatus = `Selected: ${this.tempFile.name}`;
      setTimeout(() => {
    if (this.tempFile && this.tempStatus === `Selected: ${this.tempFile.name}`) {
          this.tempStatus = '';
        }
      }, 3000);
    }
  }

  async generateTempTTS() {
    if (!this.tempText.trim()) {
      alert('Please enter some text');
      return;
    }
    if (!this.tempFile) {
      alert('Please upload a temporary voice file');
      return;
    }

    this.isGeneratingTemp = true;
    this.tempStatus = 'Generating speech with temporary voice...';

    try {
      const formData = new FormData();
      formData.append('text', this.tempText);
      formData.append('language', this.tempLanguage);
      formData.append('speaker_wav', this.tempFile);

      const response = await this.http.post(`${this.API_URL}/synthesize-temp`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.tempAudioBlob = response.body;
        this.tempAudioUrl = URL.createObjectURL(this.tempAudioBlob);
        this.tempStatus = 'Audio generated successfully!';
        
        const audio = new Audio(this.tempAudioUrl);
        audio.play();
      }
    } catch (error: any) {
      console.error('Temp TTS Error:', error);
      this.tempStatus = `Generation failed: ${error.message}`;
    } finally {
      this.isGeneratingTemp = false;
    }
  }

  downloadTempAudio() {
    if (this.tempAudioBlob && this.tempAudioUrl) {
      const a = document.createElement('a');
      a.href = this.tempAudioUrl;
      a.download = `temp_tts_${Date.now()}.wav`;
      a.click();
    }
  }

  // STT Functions
  toggleRecording() {
    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = async () => {
          this.sttResult = "Transcription would appear here.";
          alert('Recording complete!');
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch(err => {
        alert('Please allow microphone access');
      });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  sendMessage() {
    if (this.contactName && this.contactEmail && this.contactMessage) {
      alert('Thank you for your message! Our team will get back to you soon.');
      this.contactName = '';
      this.contactEmail = '';
      this.contactMessage = '';
    } else {
      alert('Please fill in all fields.');
    }
  }

  subscribeNewsletter() {
    if (this.newsletterEmail) {
      alert(`Subscribed with email: ${this.newsletterEmail}`);
      this.newsletterEmail = '';
    } else {
      alert('Please enter an email address.');
    }
  }
}
