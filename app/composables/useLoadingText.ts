import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export type LoadingTextType = 'ayat' | 'hadist'

export type LoadingTextItem = {
  id: string
  type: LoadingTextType
  dalil: string
  arabic: string
  artinya: string
  sumber: string
  tema: string
}

export type LoadingTextTheme = 'muslimPatience'

export type UseLoadingTextOptions = {
  arabicTypingSpeed?: number
  meaningTypingSpeed?: number
  sourceTypingSpeed?: number
  meaningDelay?: number
  sourceDelay?: number
  autoChangeMs?: number
}

export const loadingTextThemes: Record<LoadingTextTheme, LoadingTextItem[]> = {
  muslimPatience: [
    {
      id: 'sabr-001',
      type: 'ayat',
      dalil: 'QS. Al-Baqarah: 45',
      arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
      artinya: 'Jadikan sabar dan shalat sebagai penolong dalam menghadapi beratnya kehidupan.',
      sumber: 'Al-Qur’an, Surah Al-Baqarah ayat 45',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-002',
      type: 'ayat',
      dalil: 'QS. Al-Baqarah: 153',
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
      artinya: 'Mintalah pertolongan kepada Allah dengan sabar dan shalat; Allah bersama orang-orang yang sabar.',
      sumber: 'Al-Qur’an, Surah Al-Baqarah ayat 153',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-003',
      type: 'ayat',
      dalil: 'QS. Al-Baqarah: 155',
      arabic: 'وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ وَبَشِّرِ الصَّابِرِينَ',
      artinya: 'Ujian adalah bagian dari kehidupan; kabar gembira diberikan kepada orang-orang yang sabar.',
      sumber: 'Al-Qur’an, Surah Al-Baqarah ayat 155',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-004',
      type: 'ayat',
      dalil: 'QS. Al-Baqarah: 156',
      arabic: 'الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
      artinya: 'Ketika tertimpa musibah, orang beriman mengingat bahwa dirinya milik Allah dan akan kembali kepada-Nya.',
      sumber: 'Al-Qur’an, Surah Al-Baqarah ayat 156',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-005',
      type: 'ayat',
      dalil: 'QS. Al-Baqarah: 157',
      arabic: 'أُولَٰئِكَ عَلَيْهِمْ صَلَوَاتٌ مِّن رَّبِّهِمْ وَرَحْمَةٌ وَأُولَٰئِكَ هُمُ الْمُهْتَدُونَ',
      artinya: 'Orang yang sabar mendapatkan ampunan, rahmat, dan petunjuk dari Allah.',
      sumber: 'Al-Qur’an, Surah Al-Baqarah ayat 157',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-006',
      type: 'ayat',
      dalil: 'QS. Al-Baqarah: 177',
      arabic: 'وَالصَّابِرِينَ فِي الْبَأْسَاءِ وَالضَّرَّاءِ وَحِينَ الْبَأْسِ',
      artinya: 'Kebajikan sejati tampak pada kesabaran dalam kesempitan, penderitaan, dan perjuangan.',
      sumber: 'Al-Qur’an, Surah Al-Baqarah ayat 177',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-007',
      type: 'ayat',
      dalil: 'QS. Al-Baqarah: 249',
      arabic: 'وَاللَّهُ مَعَ الصَّابِرِينَ',
      artinya: 'Kemenangan tidak selalu bergantung pada jumlah, karena Allah bersama orang-orang yang sabar.',
      sumber: 'Al-Qur’an, Surah Al-Baqarah ayat 249',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-008',
      type: 'ayat',
      dalil: 'QS. Ali Imran: 120',
      arabic: 'وَإِن تَصْبِرُوا وَتَتَّقُوا لَا يَضُرُّكُمْ كَيْدُهُمْ شَيْئًا',
      artinya: 'Kesabaran dan ketakwaan menjaga hati dari tipu daya yang merusak.',
      sumber: 'Al-Qur’an, Surah Ali Imran ayat 120',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-009',
      type: 'ayat',
      dalil: 'QS. Ali Imran: 125',
      arabic: 'بَلَىٰ إِن تَصْبِرُوا وَتَتَّقُوا',
      artinya: 'Pertolongan Allah dekat bagi orang yang sabar dan bertakwa.',
      sumber: 'Al-Qur’an, Surah Ali Imran ayat 125',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-010',
      type: 'ayat',
      dalil: 'QS. Ali Imran: 146',
      arabic: 'وَاللَّهُ يُحِبُّ الصَّابِرِينَ',
      artinya: 'Allah mencintai orang-orang yang tetap sabar.',
      sumber: 'Al-Qur’an, Surah Ali Imran ayat 146',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-011',
      type: 'ayat',
      dalil: 'QS. Ali Imran: 186',
      arabic: 'وَإِن تَصْبِرُوا وَتَتَّقُوا فَإِنَّ ذَٰلِكَ مِنْ عَزْمِ الْأُمُورِ',
      artinya: 'Sabar dan takwa dalam menghadapi ujian adalah bagian dari keteguhan yang mulia.',
      sumber: 'Al-Qur’an, Surah Ali Imran ayat 186',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-012',
      type: 'ayat',
      dalil: 'QS. Ali Imran: 200',
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُفْلِحُونَ',
      artinya: 'Orang beriman diperintahkan untuk bersabar, menguatkan kesabaran, tetap siaga, dan bertakwa.',
      sumber: 'Al-Qur’an, Surah Ali Imran ayat 200',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-013',
      type: 'ayat',
      dalil: 'QS. Al-Anfal: 46',
      arabic: 'وَاصْبِرُوا إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
      artinya: 'Jangan berselisih hingga melemah; bersabarlah, karena Allah bersama orang-orang yang sabar.',
      sumber: 'Al-Qur’an, Surah Al-Anfal ayat 46',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-014',
      type: 'ayat',
      dalil: 'QS. Al-Anfal: 65',
      arabic: 'إِن يَكُن مِّنكُمْ عِشْرُونَ صَابِرُونَ يَغْلِبُوا مِائَتَيْنِ',
      artinya: 'Kesabaran membuat kekuatan iman jauh lebih besar daripada ukuran lahiriah.',
      sumber: 'Al-Qur’an, Surah Al-Anfal ayat 65',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-015',
      type: 'ayat',
      dalil: 'QS. Yunus: 109',
      arabic: 'وَاتَّبِعْ مَا يُوحَىٰ إِلَيْكَ وَاصْبِرْ حَتَّىٰ يَحْكُمَ اللَّهُ',
      artinya: 'Ikutilah petunjuk Allah dan bersabarlah sampai Allah memberikan keputusan terbaik.',
      sumber: 'Al-Qur’an, Surah Yunus ayat 109',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-016',
      type: 'ayat',
      dalil: 'QS. Hud: 11',
      arabic: 'إِلَّا الَّذِينَ صَبَرُوا وَعَمِلُوا الصَّالِحَاتِ',
      artinya: 'Orang yang sabar dan beramal saleh akan mendapatkan ampunan dan pahala yang besar.',
      sumber: 'Al-Qur’an, Surah Hud ayat 11',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-017',
      type: 'ayat',
      dalil: 'QS. Hud: 49',
      arabic: 'فَاصْبِرْ إِنَّ الْعَاقِبَةَ لِلْمُتَّقِينَ',
      artinya: 'Bersabarlah, karena akhir yang baik disediakan bagi orang-orang yang bertakwa.',
      sumber: 'Al-Qur’an, Surah Hud ayat 49',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-018',
      type: 'ayat',
      dalil: 'QS. Hud: 115',
      arabic: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
      artinya: 'Bersabarlah, karena Allah tidak menyia-nyiakan pahala orang yang berbuat baik.',
      sumber: 'Al-Qur’an, Surah Hud ayat 115',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-019',
      type: 'ayat',
      dalil: 'QS. Yusuf: 18',
      arabic: 'فَصَبْرٌ جَمِيلٌ وَاللَّهُ الْمُسْتَعَانُ',
      artinya: 'Kesabaran yang indah adalah tetap bersandar kepada Allah ketika hati sedang berat.',
      sumber: 'Al-Qur’an, Surah Yusuf ayat 18',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-020',
      type: 'ayat',
      dalil: 'QS. Yusuf: 83',
      arabic: 'فَصَبْرٌ جَمِيلٌ عَسَى اللَّهُ أَن يَأْتِيَنِي بِهِمْ جَمِيعًا',
      artinya: 'Kesabaran yang indah lahir dari keyakinan bahwa Allah mampu menghadirkan jalan keluar.',
      sumber: 'Al-Qur’an, Surah Yusuf ayat 83',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-021',
      type: 'ayat',
      dalil: 'QS. Ar-Ra’d: 22',
      arabic: 'وَالَّذِينَ صَبَرُوا ابْتِغَاءَ وَجْهِ رَبِّهِمْ',
      artinya: 'Kesabaran paling mulia adalah sabar karena mengharap ridha Allah.',
      sumber: 'Al-Qur’an, Surah Ar-Ra’d ayat 22',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-022',
      type: 'ayat',
      dalil: 'QS. Ibrahim: 5',
      arabic: 'إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّكُلِّ صَبَّارٍ شَكُورٍ',
      artinya: 'Tanda-tanda kebesaran Allah menjadi pelajaran bagi hamba yang sabar dan banyak bersyukur.',
      sumber: 'Al-Qur’an, Surah Ibrahim ayat 5',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-023',
      type: 'ayat',
      dalil: 'QS. Ibrahim: 12',
      arabic: 'وَلَنَصْبِرَنَّ عَلَىٰ مَا آذَيْتُمُونَا',
      artinya: 'Orang beriman bertawakal kepada Allah dan bersabar atas gangguan yang mereka hadapi.',
      sumber: 'Al-Qur’an, Surah Ibrahim ayat 12',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-024',
      type: 'ayat',
      dalil: 'QS. An-Nahl: 96',
      arabic: 'وَلَنَجْزِيَنَّ الَّذِينَ صَبَرُوا أَجْرَهُم بِأَحْسَنِ مَا كَانُوا يَعْمَلُونَ',
      artinya: 'Orang sabar akan diberi balasan terbaik atas amalnya.',
      sumber: 'Al-Qur’an, Surah An-Nahl ayat 96',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-025',
      type: 'ayat',
      dalil: 'QS. An-Nahl: 126',
      arabic: 'وَلَئِن صَبَرْتُمْ لَهُوَ خَيْرٌ لِّلصَّابِرِينَ',
      artinya: 'Bersabar adalah pilihan yang lebih baik bagi orang yang mampu menahan diri.',
      sumber: 'Al-Qur’an, Surah An-Nahl ayat 126',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-026',
      type: 'ayat',
      dalil: 'QS. An-Nahl: 127',
      arabic: 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ',
      artinya: 'Kesabaran seorang hamba hanya kuat dengan pertolongan Allah.',
      sumber: 'Al-Qur’an, Surah An-Nahl ayat 127',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-027',
      type: 'ayat',
      dalil: 'QS. Al-Kahf: 28',
      arabic: 'وَاصْبِرْ نَفْسَكَ مَعَ الَّذِينَ يَدْعُونَ رَبَّهُم',
      artinya: 'Teguhkan diri bersama orang-orang yang mengingat Allah dan mengharap ridha-Nya.',
      sumber: 'Al-Qur’an, Surah Al-Kahf ayat 28',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-028',
      type: 'ayat',
      dalil: 'QS. Maryam: 65',
      arabic: 'فَاعْبُدْهُ وَاصْطَبِرْ لِعِبَادَتِهِ',
      artinya: 'Sembahlah Allah dan bersabarlah dalam beribadah kepada-Nya.',
      sumber: 'Al-Qur’an, Surah Maryam ayat 65',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-029',
      type: 'ayat',
      dalil: 'QS. Taha: 130',
      arabic: 'فَاصْبِرْ عَلَىٰ مَا يَقُولُونَ وَسَبِّحْ بِحَمْدِ رَبِّكَ',
      artinya: 'Bersabarlah atas ucapan yang menyakitkan dan kuatkan hati dengan mengingat Allah.',
      sumber: 'Al-Qur’an, Surah Taha ayat 130',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-030',
      type: 'ayat',
      dalil: 'QS. Al-Hajj: 35',
      arabic: 'وَالصَّابِرِينَ عَلَىٰ مَا أَصَابَهُمْ وَالْمُقِيمِي الصَّلَاةِ',
      artinya: 'Orang yang sabar, menjaga shalat, dan berbagi rezeki adalah hamba yang lembut hatinya.',
      sumber: 'Al-Qur’an, Surah Al-Hajj ayat 35',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-031',
      type: 'ayat',
      dalil: 'QS. Al-Mu’minun: 111',
      arabic: 'إِنِّي جَزَيْتُهُمُ الْيَوْمَ بِمَا صَبَرُوا أَنَّهُمْ هُمُ الْفَائِزُونَ',
      artinya: 'Allah memberi kemenangan dan keberuntungan kepada hamba yang sabar.',
      sumber: 'Al-Qur’an, Surah Al-Mu’minun ayat 111',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-032',
      type: 'ayat',
      dalil: 'QS. Al-Furqan: 75',
      arabic: 'أُولَٰئِكَ يُجْزَوْنَ الْغُرْفَةَ بِمَا صَبَرُوا',
      artinya: 'Orang yang sabar akan dibalas dengan tempat mulia dan sambutan penuh kedamaian.',
      sumber: 'Al-Qur’an, Surah Al-Furqan ayat 75',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-033',
      type: 'ayat',
      dalil: 'QS. Al-Qasas: 54',
      arabic: 'أُولَٰئِكَ يُؤْتَوْنَ أَجْرَهُم مَّرَّتَيْنِ بِمَا صَبَرُوا',
      artinya: 'Orang yang sabar akan mendapatkan pahala berlipat karena keteguhan mereka.',
      sumber: 'Al-Qur’an, Surah Al-Qasas ayat 54',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-034',
      type: 'ayat',
      dalil: 'QS. Al-Ankabut: 59',
      arabic: 'الَّذِينَ صَبَرُوا وَعَلَىٰ رَبِّهِمْ يَتَوَكَّلُونَ',
      artinya: 'Orang yang sabar dan bertawakal kepada Allah tidak akan kehilangan tempat mulia di sisi-Nya.',
      sumber: 'Al-Qur’an, Surah Al-Ankabut ayat 59',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-035',
      type: 'ayat',
      dalil: 'QS. Luqman: 17',
      arabic: 'وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ إِنَّ ذَٰلِكَ مِنْ عَزْمِ الْأُمُورِ',
      artinya: 'Dirikan shalat, ajak kepada kebaikan, dan bersabarlah atas apa yang menimpa.',
      sumber: 'Al-Qur’an, Surah Luqman ayat 17',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-036',
      type: 'ayat',
      dalil: 'QS. As-Sajdah: 24',
      arabic: 'وَجَعَلْنَا مِنْهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا لَمَّا صَبَرُوا',
      artinya: 'Kepemimpinan yang baik lahir dari kesabaran dan keyakinan kepada ayat-ayat Allah.',
      sumber: 'Al-Qur’an, Surah As-Sajdah ayat 24',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-037',
      type: 'ayat',
      dalil: 'QS. Al-Ahzab: 35',
      arabic: 'وَالصَّابِرِينَ وَالصَّابِرَاتِ',
      artinya: 'Laki-laki dan perempuan yang sabar disiapkan ampunan dan pahala besar.',
      sumber: 'Al-Qur’an, Surah Al-Ahzab ayat 35',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-038',
      type: 'ayat',
      dalil: 'QS. Az-Zumar: 10',
      arabic: 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ',
      artinya: 'Orang-orang yang sabar akan disempurnakan pahalanya tanpa batas.',
      sumber: 'Al-Qur’an, Surah Az-Zumar ayat 10',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-039',
      type: 'ayat',
      dalil: 'QS. Fussilat: 35',
      arabic: 'وَمَا يُلَقَّاهَا إِلَّا الَّذِينَ صَبَرُوا',
      artinya: 'Akhlak yang luhur tidak diraih kecuali oleh orang yang sabar.',
      sumber: 'Al-Qur’an, Surah Fussilat ayat 35',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-040',
      type: 'ayat',
      dalil: 'QS. Asy-Syura: 43',
      arabic: 'وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ',
      artinya: 'Sabar dan memaafkan termasuk perkara mulia yang membutuhkan keteguhan hati.',
      sumber: 'Al-Qur’an, Surah Asy-Syura ayat 43',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-041',
      type: 'hadist',
      dalil: 'Hadist tentang hadiah terbaik',
      arabic: 'وَمَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ',
      artinya: 'Tidak ada pemberian yang lebih baik dan lebih luas bagi seorang hamba daripada kesabaran.',
      sumber: 'HR. Bukhari no. 1469 dan Muslim no. 1053',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-042',
      type: 'hadist',
      dalil: 'Hadist tentang perkara mukmin',
      arabic: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ',
      artinya: 'Keadaan seorang mukmin selalu baik; saat mendapat nikmat ia bersyukur, dan saat tertimpa ujian ia bersabar.',
      sumber: 'HR. Muslim no. 2999',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-043',
      type: 'hadist',
      dalil: 'Hadist tentang awal musibah',
      arabic: 'إِنَّمَا الصَّبْرُ عِنْدَ الصَّدْمَةِ الْأُولَى',
      artinya: 'Kesabaran yang paling nyata adalah ketika seseorang mampu menahan diri pada awal musibah.',
      sumber: 'HR. Bukhari no. 1283 dan Muslim no. 926',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-044',
      type: 'hadist',
      dalil: 'Hadist tentang gugurnya dosa',
      arabic: 'مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حَزَنٍ وَلَا أَذًى وَلَا غَمٍّ إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ',
      artinya: 'Setiap sakit, sedih, gelisah, dan kesulitan yang menimpa seorang muslim dapat menjadi sebab gugurnya dosa.',
      sumber: 'HR. Bukhari dan Muslim',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-045',
      type: 'hadist',
      dalil: 'Hadist tentang balasan surga',
      arabic: 'مَا لِعَبْدِي الْمُؤْمِنِ عِنْدِي جَزَاءٌ إِذَا قَبَضْتُ صَفِيَّهُ مِنْ أَهْلِ الدُّنْيَا ثُمَّ احْتَسَبَهُ إِلَّا الْجَنَّةُ',
      artinya: 'Hamba beriman yang sabar ketika kehilangan orang tercinta dijanjikan balasan yang sangat mulia.',
      sumber: 'HR. Bukhari',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-046',
      type: 'hadist',
      dalil: 'Hadist tentang mukmin yang kuat',
      arabic: 'احْرِصْ عَلَى مَا يَنْفَعُكَ وَاسْتَعِنْ بِاللَّهِ وَلَا تَعْجِزْ',
      artinya: 'Seorang mukmin dianjurkan mengejar hal yang bermanfaat, meminta pertolongan Allah, dan tidak larut dalam kelemahan.',
      sumber: 'HR. Muslim no. 2664',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-047',
      type: 'hadist',
      dalil: 'Hadist tentang sabar sebagai cahaya',
      arabic: 'وَالصَّبْرُ ضِيَاءٌ',
      artinya: 'Kesabaran adalah cahaya yang menuntun hati saat jalan terasa gelap.',
      sumber: 'HR. Muslim no. 223',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-048',
      type: 'hadist',
      dalil: 'Hadist tentang ujian sebagai kebaikan',
      arabic: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُصِبْ مِنْهُ',
      artinya: 'Ketika Allah menghendaki kebaikan bagi seorang hamba, ujian dapat menjadi jalan untuk mengangkat derajatnya.',
      sumber: 'HR. Bukhari no. 5645',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-049',
      type: 'hadist',
      dalil: 'Hadist tentang besarnya balasan',
      arabic: 'إِنَّ عِظَمَ الْجَزَاءِ مَعَ عِظَمِ الْبَلَاءِ',
      artinya: 'Besarnya balasan sebanding dengan beratnya ujian; orang yang ridha akan mendapatkan keridhaan Allah.',
      sumber: 'HR. Tirmidzi no. 2396',
      tema: 'kesabaran'
    },
    {
      id: 'sabr-050',
      type: 'hadist',
      dalil: 'Hadist tentang penghapus dosa',
      arabic: 'مَا مِنْ مُصِيبَةٍ تُصِيبُ الْمُسْلِمَ إِلَّا كَفَّرَ اللَّهُ بِهَا عَنْهُ',
      artinya: 'Musibah yang menimpa seorang muslim dapat menjadi sebab dihapusnya dosa.',
      sumber: 'HR. Bukhari dan Muslim',
      tema: 'kesabaran'
    }
  ]
}

function pickRandomItem(items: LoadingTextItem[], exceptId?: string) {
  if (!items.length) return null
  if (items.length === 1) return items[0]

  let selected = items[Math.floor(Math.random() * items.length)]

  while (selected.id === exceptId) {
    selected = items[Math.floor(Math.random() * items.length)]
  }

  return selected
}

export function useLoadingText(
  theme: LoadingTextTheme = 'muslimPatience',
  options: UseLoadingTextOptions = {}
) {
  const arabicTypingSpeed = options.arabicTypingSpeed ?? 18
  const meaningTypingSpeed = options.meaningTypingSpeed ?? 22
  const sourceTypingSpeed = options.sourceTypingSpeed ?? 14
  const meaningDelay = options.meaningDelay ?? 250
  const sourceDelay = options.sourceDelay ?? 280
  const autoChangeMs = options.autoChangeMs ?? 0

  const items = computed(() => loadingTextThemes[theme] || [])

  const fallbackItem: LoadingTextItem = {
    id: 'default',
    type: 'ayat',
    dalil: 'Renungan',
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    artinya: 'Sesungguhnya Allah bersama orang-orang yang sabar.',
    sumber: 'Al-Qur’an',
    tema: 'default'
  }

  const currentText = ref<LoadingTextItem>(items.value[0] || fallbackItem)

  const typedArabic = ref('')
  const typedMeaning = ref('')
  const typedSource = ref('')
  const isTyping = ref(false)

  let arabicTimer: ReturnType<typeof setTimeout> | null = null
  let meaningTimer: ReturnType<typeof setTimeout> | null = null
  let sourceTimer: ReturnType<typeof setTimeout> | null = null
  let autoChangeTimer: ReturnType<typeof setInterval> | null = null

  function clearTypingTimers() {
    if (arabicTimer) clearTimeout(arabicTimer)
    if (meaningTimer) clearTimeout(meaningTimer)
    if (sourceTimer) clearTimeout(sourceTimer)

    arabicTimer = null
    meaningTimer = null
    sourceTimer = null
  }

  function startTyping() {
    clearTypingTimers()

    const arabic = currentText.value.arabic || ''
    const meaning = currentText.value.artinya || ''
    const source = currentText.value.sumber || ''

    typedArabic.value = ''
    typedMeaning.value = ''
    typedSource.value = ''
    isTyping.value = true

    let arabicIndex = 0
    let meaningIndex = 0
    let sourceIndex = 0

    function typeArabic() {
      typedArabic.value = arabic.slice(0, arabicIndex)
      arabicIndex += 1

      if (arabicIndex <= arabic.length) {
        arabicTimer = setTimeout(typeArabic, arabicTypingSpeed)
        return
      }

      meaningTimer = setTimeout(typeMeaning, meaningDelay)
    }

    function typeMeaning() {
      typedMeaning.value = meaning.slice(0, meaningIndex)
      meaningIndex += 1

      if (meaningIndex <= meaning.length) {
        meaningTimer = setTimeout(typeMeaning, meaningTypingSpeed)
        return
      }

      sourceTimer = setTimeout(typeSource, sourceDelay)
    }

    function typeSource() {
      typedSource.value = source.slice(0, sourceIndex)
      sourceIndex += 1

      if (sourceIndex <= source.length) {
        sourceTimer = setTimeout(typeSource, sourceTypingSpeed)
        return
      }

      isTyping.value = false
    }

    typeArabic()
  }

  function refreshLoadingText() {
    const selected = pickRandomItem(items.value, currentText.value?.id)

    if (!selected) return

    currentText.value = selected

    if (typeof window !== 'undefined') {
      startTyping()
    }
  }

  onMounted(() => {
    refreshLoadingText()

    if (autoChangeMs > 0) {
      autoChangeTimer = setInterval(() => {
        refreshLoadingText()
      }, autoChangeMs)
    }
  })

  onBeforeUnmount(() => {
    clearTypingTimers()

    if (autoChangeTimer) {
      clearInterval(autoChangeTimer)
      autoChangeTimer = null
    }
  })

  return {
    items,
    currentText,
    typedArabic,
    typedMeaning,
    typedSource,
    isTyping,
    refreshLoadingText
  }
}