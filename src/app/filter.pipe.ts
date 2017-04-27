import {Pipe, PipeTransform, Injectable} from "@angular/core";

@Pipe({
  name: 'filter',
  pure: false
})
@Injectable()
export class FilterPipe implements PipeTransform {

  transform(items: any, term: any): any {
    if (term === undefined) return items;

    return items.filter(item => {
      term = this.removeDiacritics(term.toLowerCase())

      let title = this.removeDiacritics(item.title.toLowerCase());
      let artist = this.removeDiacritics(item.artist.toLowerCase());
      let tags = this.removeDiacritics(item.tags.toLowerCase());

      return title.includes(term) || artist.includes(term) || tags.includes(term);
    })
  }

  /**
   * Remove diacrritics from string
   */
  removeDiacritics(text) {
    if (text) {
      let dia = "áäčďéíľĺňóôŕšťúýžÁČĎÉÍĽĹŇÓŠŤÚÝŽ";
      let nodia = "aacdeillnoorstuyzACDEILLNOSTUYZ";

      let convertText = "";
      for (let i = 0; i < text.length; i++) {
        if (dia.indexOf(text.charAt(i)) != -1) {
          convertText += nodia.charAt(dia.indexOf(text.charAt(i)));
        }
        else {
          convertText += text.charAt(i);
        }
      }
      return convertText;
    }
    return "";
  }
}
