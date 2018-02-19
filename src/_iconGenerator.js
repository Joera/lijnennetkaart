class IconGenerator {

    constructor() {}

    blogIcon(item) {

        return L.divIcon({

            iconSize: (45, 63),
            className: 'blog yellow ' + item.properties.slug,
            iconAnchor: (0, 0),
            popupAnchor: (0, 0),
            html: `

               
                        <svg width="53px" height="46px" viewBox="0 0 53 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <defs>
                                <linearGradient x1="63.6706155%" y1="0%" x2="77.9408035%" y2="100%" id="linearGradient-1">
                                    <stop stop-color="#000000" stop-opacity="0" offset="0%"></stop>
                                    <stop stop-color="#000000" stop-opacity="0.5" offset="100%"></stop>
                                </linearGradient>
                                <filter x="-6.2%" y="-17.6%" width="112.5%" height="135.1%" filterUnits="objectBoundingBox" id="filter-2">
                                    <feGaussianBlur stdDeviation="1.2" in="SourceGraphic"></feGaussianBlur>
                                </filter>
                            </defs>
                             <polygon class="shadow" fill="url(#linearGradient-1)" filter="url(#filter-2)" transform="translate(34.041211, 33.569908) scale(-1, 1) translate(-34.041211, -33.569908) " points="5.18789062 30.0335664 37.2 23.3226562 62.8945312 34.3583711 48.9246094 37.7324922 57.4957031 43.8171602 38.7899414 40.0384492 30.8824219 41.3670625"></polygon>
                             <polygon class="marker" fill="#78C6C2" transform="translate(14.687695, 22.335937) scale(-1, 1) translate(-14.687695, -22.335937) " points="0 6.14137893 29.3753906 0 29.3753906 30.8630859 18.0421875 33.6676758 18.0421875 44.671875 7.90751953 35.9736328 0 37.2914063"></polygon>
                              <g class="excavator" transform="translate(25, 11) scale(-.7, .7)" fill-rule="nonzero" fill="#000000">
                                    <path d="M12.0000143,6.00000715 L6.00000715,6.00000715 L6.00000715,12.0000143 L12.0000143,12.0000143 L12.0000143,6.00000715 Z M14.0000167,16.0000191 L14.0000167,18.0000215 L4.00000477,18.0000215 L4.00000477,16.0000191 L14.0000167,16.0000191 Z M14.0000167,4.00000477 L14.0000167,14.0000167 L4.00000477,14.0000167 L4.00000477,4.00000477 L14.0000167,4.00000477 Z M24.0000286,16.0000191 L24.0000286,18.0000215 L16.0000191,18.0000215 L16.0000191,16.0000191 L24.0000286,16.0000191 Z M24.0000286,12.0000143 L24.0000286,14.0000167 L16.0000191,14.0000167 L16.0000191,12.0000143 L24.0000286,12.0000143 Z M24.0000286,8.00000954 L24.0000286,10.0000119 L16.0000191,10.0000119 L16.0000191,8.00000954 L24.0000286,8.00000954 Z M24.0000286,4.00000477 L24.0000286,6.00000715 L16.0000191,6.00000715 L16.0000191,4.00000477 L24.0000286,4.00000477 Z M26.000031,19.0000226 L26.000031,2.00000238 L2.00000238,2.00000238 L2.00000238,19.0000226 C2.00000238,19.3437731 1.93750231,19.6875235 1.82812718,20.0000238 L25.0000298,20.0000238 C25.5469055,20.0000238 26.000031,19.5468983 26.000031,19.0000226 Z M28.0000334,0 L28.0000334,19.0000226 C28.0000334,20.6562746 26.6562818,22.0000262 25.0000298,22.0000262 L6.34677063e-12,22.0000262 C6.3468722e-12,19.1413023 5.29235914e-12,12.4746277 3.18323146e-12,2.00000238 L3.18323146e-12,0 L28.0000334,0 Z" fill="#000000"></path>
                              </g>
                        </svg>
                   
                     `
        });
    }

    projectIcon(item){

        return L.divIcon({

            iconSize: (45, 63),
            className: 'project ' + item.properties.slug,
            iconAnchor: (0, 0),
            popupAnchor: (0, 0),
            html: `
                       
                       
                            <svg width="63px" height="45px" viewBox="0 0 63 45" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <defs>
                                    <linearGradient x1="51.724294%" y1="0%" x2="53.5242129%" y2="100%" id="linearGradient-1">
                                        <stop stop-color="#000000" stop-opacity="0" offset="0%"></stop>
                                        <stop stop-color="#000000" stop-opacity="0.5" offset="100%"></stop>
                                    </linearGradient>
                                    <polygon id="path-2" points="18.5575702 11.1869203 18.5575702 0.0403432594 0.0222639772 0.0403432594 0.0222639772 11.1869203"></polygon>
                                </defs>
                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="projectIcon" transform="translate(0.000000, -11.000000)">
                                        <polygon class="shadow"  fill="url(#linearGradient-1)" fill-rule="nonzero" transform="translate(34.041211, 44.569908) scale(-1, 1) translate(-34.041211, -44.569908) " points="5.1878908 41.0335664 37.2000002 34.3226562 62.8945314 45.3583711 48.9246096 48.7324922 57.4957033 54.8171602 38.7899416 51.0384492 30.8824221 52.3670625"></polygon>
                                        <polygon class="marker" fill="#78C6C2" fill-rule="nonzero" transform="translate(14.687695, 33.335938) scale(-1, 1) translate(-14.687695, -33.335938) " points="-6e-07 17.1413789 29.37539 11 29.37539 41.8630859 18.0421869 44.6676758 18.0421869 55.671875 7.90751893 46.9736328 -6e-07 48.2914063"></polygon>
                                        <g id="Group" transform="translate(3.400000, 24.000000)">
                                            <g id="Group-3" transform="translate(2.685047, 1.525853)">
                                                <g id="Fill-1-Clipped">
                                                    <mask id="mask-3" fill="white">
                                                        <use xlink:href="#path-2"></use>
                                                    </mask>
                                                    <g id="path-1"></g>
                                                    <path d="M5.70283856,8.65433574 C5.70146864,7.8963936 5.10862107,7.2285561 4.29291454,7.22750388 C3.49479781,7.22656242 2.88463442,7.87147224 2.88008627,8.65234206 C2.87542854,9.44384496 3.5178125,10.0878134 4.3112167,10.0788416 C5.09596299,10.0699807 5.69982473,9.4224126 5.70283856,8.65433574 L5.70283856,8.65433574 Z M12.0008645,8.65477884 C12.0047003,9.4518198 12.6395771,10.0896409 13.4331457,10.0791739 C14.1959184,10.0690393 14.8224661,9.44550642 14.8213702,8.65206516 C14.820329,7.8597315 14.1948773,7.22063664 13.399336,7.22739312 C12.5822596,7.23431574 11.9967548,7.91317404 12.0008645,8.65477884 L12.0008645,8.65477884 Z M12.2711776,0.979493178 C12.1349525,1.66676937 11.9986178,2.35000276 11.8642011,3.03362382 C11.7300583,3.71591573 11.5904906,4.39715542 11.4601288,5.08398856 L17.2874495,5.08398856 C17.2874495,4.93113745 17.284874,4.78559661 17.2887646,4.64016653 C17.2902441,4.58351193 17.271668,4.54280702 17.2358856,4.50104987 C16.8460605,4.04676086 16.4578793,3.59103194 16.0693694,3.1356907 C15.4764122,2.44077196 14.8830715,1.74618549 14.2916486,1.04993761 C14.2451808,0.995165958 14.1972883,0.972792096 14.1247373,0.973179762 C13.5434518,0.97611495 12.9621664,0.974564286 12.380881,0.974785806 C12.3470713,0.974785806 12.3133712,0.977610234 12.2711776,0.979493178 L12.2711776,0.979493178 Z M10.3439709,6.05132562 C10.7232202,4.04504405 11.1007708,2.04767877 11.4799653,0.0414525568 C11.5653388,0.0414525568 11.6437532,0.0413971759 11.7221675,0.0414525568 C12.6510296,0.0416186993 13.5800014,0.042726316 14.5088635,0.04034494 C14.584538,0.0401234167 14.6347319,0.0617773242 14.6848711,0.119539537 C15.4673707,1.02130571 16.2521718,1.92113356 17.0363701,2.82145983 C17.4046052,3.24418176 17.7716348,3.66801131 18.142281,4.08857339 C18.1939544,4.14716632 18.217024,4.20409781 18.2168596,4.28268322 C18.2146129,5.35009348 18.2153252,6.41755914 18.2152705,7.48508016 L18.2152705,7.67924538 L18.5530385,7.67924538 C18.561258,7.96080156 18.5557783,8.23299834 18.5562715,8.51604984 L15.9236096,8.51604984 C16.0061338,9.92216928 14.8903046,11.1509039 13.486463,11.1854062 C12.7579384,11.2032942 12.1306784,10.9489854 11.6209029,10.4238643 C11.1111274,9.89879856 10.8805421,9.25782072 10.9052555,8.51854194 L6.79987236,8.51854194 C6.81943482,9.35518026 6.52923048,10.0538649 5.89999778,10.5938281 C5.40167485,11.0215343 4.81633445,11.2174163 4.16414184,11.1830802 C3.47666004,11.1469165 2.89570339,10.8660249 2.43283405,10.3503739 C1.96958112,9.83433528 1.76442156,9.2195526 1.78376486,8.51532984 L0.0222639772,8.51532984 L0.0222639772,7.68666642 L0.354442735,7.68666642 C0.359922425,7.14116514 0.354168751,6.6043587 0.357730549,6.05271018 C1.0251019,6.04933194 1.68732233,6.05176872 2.34954277,6.051381 C3.01696891,6.05099334 3.68444985,6.05077182 4.351876,6.05077182 C5.01590473,6.05077182 5.67993346,6.05121486 6.34396218,6.05132562 C7.01144316,6.05143638 7.6788693,6.05132562 8.34629544,6.05132562 L10.3439709,6.05132562 Z" id="Fill-1" fill="#151616" fill-rule="nonzero" mask="url(#mask-3)"></path>
                                                </g>
                                            </g>
                                            <g id="Group-6" transform="translate(0.000000, 0.030570)" fill-rule="nonzero" fill="#151616">
                                                <path d="M4.18350706,3.36649588 C4.16093075,3.5779953 4.17106817,6.15337038 4.19375408,6.2260854 L4.81317815,6.2260854 L4.81317815,3.36649588 L4.18350706,3.36649588 Z M6.6664638,6.22614078 C6.68969772,6.11338542 6.68542356,3.18473597 6.66306642,3.11058103 C6.48645606,3.09308069 6.10994658,3.09989253 6.04051896,3.12176796 C6.01898376,3.39761991 6.02977872,6.14639238 6.05323182,6.22614078 L6.6664638,6.22614078 Z M7.89977748,6.22575312 L8.53580502,6.22575312 L8.53580502,2.85189714 L7.89977748,2.85189714 L7.89977748,6.22575312 Z M9.75974838,2.59487467 L9.75974838,6.22519932 L10.3875563,6.22519932 C10.4106806,6.1038045 10.4050366,2.67357084 10.3816383,2.59487467 L9.75974838,2.59487467 Z M-1.64390675e-05,4.09802136 C0.212650298,3.76202582 0.420220924,3.43433741 0.627517566,3.10642747 C0.842266584,2.76666603 1.05745398,2.42712611 1.27061389,2.08642321 C1.30590309,2.02993475 1.34426091,2.00169052 1.41604484,1.9936603 C1.96921946,1.931523 2.52151733,1.86118934 3.07430838,1.7953969 C3.56906951,1.73641631 4.06426903,1.68086933 4.55908496,1.62216565 C4.99581619,1.5702738 5.43227343,1.51522525 5.86900466,1.46311188 C6.1931283,1.42445606 6.51769026,1.38923384 6.84181386,1.35068878 C7.21711782,1.30599644 7.59220254,1.25864583 7.96756122,1.21373197 C8.23025754,1.18227565 8.4932826,1.15358838 8.7560337,1.12229821 C9.0187848,1.09095265 9.28115232,1.05705958 9.54384864,1.02571403 C9.80659974,0.994479234 10.0696796,0.965625816 10.3324307,0.934612548 C10.5951818,0.90348852 10.8577137,0.870592302 11.1204648,0.839246748 C11.325186,0.814879176 11.5299071,0.79056699 11.7349024,0.768359274 C11.8335367,0.757670772 11.8343039,0.759996768 11.8620311,0.666070872 C11.9161705,0.483147963 11.9695974,0.299948153 12.0236819,0.116969867 C12.0323947,0.0873411186 12.0432992,0.0583215598 12.0545874,0.0248161532 L15.4000472,0.0248161532 C15.4069517,0.325589481 15.4019104,0.622320006 15.4027323,0.929129844 L13.6735068,0.929129844 C13.2557353,2.9930629 12.8394981,5.04946415 12.421617,7.11406176 L12.1788119,7.11406176 C9.10963806,7.11384024 6.04046412,7.11323106 2.97129022,7.11550164 C2.8940814,7.11555702 2.84421623,7.08991572 2.7935839,7.03675014 C1.88028411,6.07688946 0.965669184,5.11835791 0.0515474362,4.15932795 C0.0351083686,4.14210451 0.020751583,4.12288736 -1.64390675e-05,4.09802136 L-1.64390675e-05,4.09802136 Z" id="Fill-4"></path>
                                            </g>
                                        </g>
                                        <rect id="Rectangle" x="0" y="1.77635684e-15" width="62" height="62"></rect>
                                    </g>
                                </g>
                            </svg>
                    
                     `
        });
    }
}