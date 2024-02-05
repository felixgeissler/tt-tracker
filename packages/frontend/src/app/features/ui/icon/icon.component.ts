import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { IconService } from './icon.service';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  private elementRef: ElementRef<SVGSVGElement> = inject(ElementRef);
  private renderer = inject(Renderer2);
  private iconService = inject(IconService);

  private readonly svg = signal('');

  name = input.required<string>();
  class = input<string>('');

  constructor() {
    effect(() => {
      this.iconService.getIconSvg(this.name()).subscribe({
        next: svg => this.svg.set(svg),
      });
    });

    effect(() => {
      // XSS Caution - This assumes the content is safe!
      this.renderer.setProperty(
        this.elementRef.nativeElement,
        'innerHTML',
        this.svg()
      );
      this.class()
        .split(' ')
        .forEach(componentClass => {
          const supportedClassOnSvg = ['fill-', 'stroke-', 'w-', 'h-'].some(
            supportedClass => componentClass.startsWith(supportedClass)
          );
          const svgElement = this.elementRef.nativeElement.children[0];
          if (supportedClassOnSvg && svgElement) {
            this.renderer.addClass(svgElement, componentClass);
          }
        });
    });
  }
}
