import { Component } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyActionButtonModule } from '@skyux/layout';

@Component({
  selector: 'app-welcome-to-skyux',
  standalone: true,
  imports: [SkyActionButtonModule, SkyAlertModule],
  templateUrl: './welcome-to-skyux.component.html',
  styleUrl: './welcome-to-skyux.component.css',
})
export class WelcomeToSkyuxComponent {
  protected readonly actions = [
    {
      link: { url: 'https://developer.blackbaud.com/' },
      icon: 'wrench-screwdriver',
      heading: 'Join Blackbaud SKY Developer Community',
      details: `Find the tools and partners to integrate with Blackbaud's       platform.`,
    },
    {
      link: { url: 'https://developer.blackbaud.com/skyux/' },
      icon: 'question-circle',
      heading: 'Learn More about SKY UX',
      details: `The documentation site includes design principles and code examples.`,
    },
    {
      link: { url: 'https://angular.dev/tutorials/learn-angular' },
      icon: 'link',
      heading: 'Learn Angular',
      details: `Angular provides a browser-based learning environment.`,
    },
    {
      link: { url: 'https://developer.blackbaud.com/skyux/learn/overview' },
      icon: 'online-learning',
      heading: 'Get Started with SKY UX',
      details: `Explore the design principles and developer tools for working with SKY UX.`,
    },
  ];
}
