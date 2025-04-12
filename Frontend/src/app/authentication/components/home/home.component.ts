import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  publishedDate: Date;
  source: string;
  sourceIcon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    DatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  public fontSizeIncreased = false;
  public darkModeEnabled = false;
  private clockSubscription!: Subscription;
  private newsRefreshSubscription!: Subscription;

  public sliderImages: string[] = [
    'assets/backgroundimg.jpg',
    'assets/image2.jpg',
    'assets/image3.jpg',
  ];

  public currentSlide = 0;
  private sliderInterval: any;

  // News related properties
  public isLoadingNews = true;
  public newsItems: NewsItem[] = [];

  public features = [
    {
      icon: 'fa-solid fa-indian-rupee-sign',
      title: 'आर्थिक सक्षमीकरण',
      description: 'कमी व्याज दरांवर कर्ज उपलब्ध करून आर्थिक स्वातंत्र्य मिळवा',
    },
    {
      icon: 'fa-solid fa-users',
      title: 'सामाजिक एकता',
      description:
        'समान उद्दिष्टांसाठी एकत्र काम करणाऱ्या महिलांचे मजबूत नेटवर्क',
    },
    {
      icon: 'fa-solid fa-book',
      title: 'कौशल्य विकास',
      description: 'नेतृत्व, वित्तीय साक्षरता आणि व्यवसाय कौशल्यांचा विकास',
    },
    {
      icon: 'fa-solid fa-handshake',
      title: 'सरकारी अनुदान',
      description: 'विशेष योजनांद्वारे सरकारकडून वित्तीय प्रोत्साहन',
    },
  ];

  public successStories = [
    {
      id: 1,
      name: 'सुवर्णा पाटील',
      groupName: 'अन्नपूर्णा बचत गट',
      story: 'बचत गटामुळे मला स्वतःचा लघुउद्योग सुरु करण्यासाठी कर्ज मिळाले.',
      image: 'assets/women1.jpg',
    },
    {
      id: 2,
      name: 'मंजुळा देशमुख',
      groupName: 'शक्ती बचत गट',
      story: 'गट प्रयत्नांतून २० महिलांना रोजगाराच्या संधी दिल्या.',
      image: 'assets/women2.jpg',
    },
    {
      id: 3,
      name: 'सविता जाधव',
      groupName: 'प्रगती बचत गट',
      story: 'बचत गटामुळे मला शिलाई प्रशिक्षण घेण्याची संधी मिळाली.',
      image: 'assets/women3.jpg',
    },
    {
      id: 4,
      name: 'रंजना कदम',
      groupName: 'स्वावलंबी बचत गट',
      story:
        'बचत गटाच्या माध्यमातून मिळालेल्या प्रशिक्षणाने माझी उत्पादकता वाढली.',
      image: 'assets/women4.jpg',
    },
  ];

  public howItWorksSteps = [
    {
      number: '१',
      title: 'गट स्थापना',
      description: '१०-२० महिलांचा समूह तयार करा आणि नियमित बैठका घ्या',
    },
    {
      number: '२',
      title: 'नियमित बचत',
      description: 'प्रत्येक सदस्य ठराविक रक्कमेची नियमित बचत करतो',
    },
    {
      number: '३',
      title: 'अंतर्गत कर्जे',
      description: 'गटातील सदस्यांना कमी व्याजदरात कर्ज उपलब्ध',
    },
    {
      number: '४',
      title: 'बँक संबंध',
      description: 'बँकेशी जोडणी करून मोठ्या प्रमाणात वित्तीय सहाय्य मिळवा',
    },
  ];

  public govtPartners = [
    {
      name: 'महाराष्ट्र सरकार',
      logo: 'assets/maharastrasarkar.jpg',
    },
    { name: 'नाबार्ड', logo: 'assets/nabard.jpg' },
    { name: 'NRLM', logo: 'assets/nrlm.png' },
    {
      name: 'महिला आर्थिक विकास महामंडळ',
      logo: 'assets/backgroundimg.jpg',
    },
  ];
  currentDate: Date | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startImageSlideshow(); // ✅ Start image rotation

    // Add animation trigger once document is loaded
    setTimeout(() => {
      this.initStatCounters();
    }, 1000);

    // Start live date updating
    this.updateDateTime();
    this.clockSubscription = interval(60000).subscribe(() => {
      this.updateDateTime();
    });

    // Fetch news on component initialization and refresh every hour
    this.newsRefreshSubscription = interval(3600000).subscribe(() => {
      // You can add your news fetch logic here
    });

    // Start the hero image slideshow
    this.startImageSlideshow();
  }

  ngAfterViewInit(): void {
    // For any animations that need to be triggered after view initialization
    this.fixHowItWorksLayout();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
    if (this.newsRefreshSubscription) {
      this.newsRefreshSubscription.unsubscribe();
    }
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  private updateDateTime(): void {
    this.currentDate = new Date();
  }

  private initStatCounters(): void {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach((counter) => {
      const target = counter.getAttribute('data-count');
      if (target) {
        // Simple counter animation for statistical values
        counter.textContent = target;
      }
    });
  }
  startImageSlideshow(): void {
    let currentIndex = 0;
    const slides = document.querySelectorAll(
      '.slider-img'
    ) as NodeListOf<HTMLElement>;

    if (slides.length === 0) return;

    setInterval(() => {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    }, 4000); // 4 seconds interval
  }

  // Fix for the how-it-works section to ensure all 4 elements are in one row
  private fixHowItWorksLayout(): void {
    const stepContainer = document.querySelector('.step-row');
    if (stepContainer) {
      const steps = stepContainer.querySelectorAll('.step');
      if (steps.length > 0) {
        const containerWidth = stepContainer.clientWidth;
        const singleStepWidth = containerWidth / steps.length - 30; // account for margins

        steps.forEach((step) => {
          const htmlStep = step as HTMLElement;
          htmlStep.style.flex = `0 0 ${singleStepWidth}px`;
          htmlStep.style.maxWidth = `${singleStepWidth}px`;
        });
      }
    }
  }

  public toggleFontSize(): void {
    this.fontSizeIncreased = !this.fontSizeIncreased;
    if (this.fontSizeIncreased) {
      document.documentElement.style.fontSize = '1.2rem';
    } else {
      document.documentElement.style.fontSize = '1rem';
    }
  }

  public toggleColorMode(): void {
    this.darkModeEnabled = !this.darkModeEnabled;
    if (this.darkModeEnabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  public scrollCarousel(direction: 'left' | 'right'): void {
    const carousel = document.querySelector('.stories-carousel') as HTMLElement;
    const scrollAmount = 350; // Approximate width of a card + margin

    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  public createNewGroup(): void {
    this.router.navigate(['/create-group']);
  }

  public joinGroup(): void {
    this.router.navigate(['/join-group']);
  }

  public viewTransactions(): void {
    this.router.navigate(['/information']);
  }
}
