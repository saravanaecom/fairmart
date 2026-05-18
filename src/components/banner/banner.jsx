import React, { useState,useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { API_FetchBannerOfferPost } from '../../services/bannerOfferPostServices';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';

const Banner = () => {
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const gifRef = useRef(null);
  const overlayRef = useRef(null);
  const [bannerSliderLists, setBannerSliderLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const GetBannerSliderLists = async () => {
    try {
      const bannerList = await API_FetchBannerOfferPost();
      setBannerSliderLists(bannerList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetBannerSliderLists();
  }, []);


 

  useEffect(() => {
    // Main timeline
    const mainTimeline = gsap.timeline();

    // Overlay animation
    mainTimeline.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    // Text animation setup
    const textElement = textRef.current;
    const text = textElement.textContent;
    textElement.innerHTML = '';
    
    // Create wrapper for letters
    const wrapper = document.createElement('div');
    wrapper.className = 'letters-wrapper inline-block';
    
    // Create individual letter spans
    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.position = 'relative';
      span.className = `letter-${index} cursor-pointer`;
      span.style.transition = 'color 0.3s ease';
      wrapper.appendChild(span);
    });
    
    textElement.appendChild(wrapper);
    mainTimeline.fromTo(
      wrapper.children,
      {
        opacity: 0,
        scale: 0,
        y: 50,
        rotateX: -90,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: 0.05,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    );

    // Wave animation
    const waveTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5
    });

    wrapper.childNodes.forEach((letter, index) => {
      // Random parameters for each letter
      const randomY = -5 - Math.random() * 15;
      const randomRotation = Math.random() * 30 - 15;
      const randomDuration = 0.5 + Math.random() * 0.3;
      
      // Wave animation
      waveTimeline
        .to(letter, {
          y: randomY,
          rotation: randomRotation,
          duration: randomDuration,
          ease: "power1.inOut"
        }, index * 0.08)
        .to(letter, {
          y: 0,
          rotation: 0,
          duration: randomDuration,
          ease: "power1.inOut"
        }, ">-0.3");
      letter.addEventListener('mouseenter', () => {
        gsap.to(letter, {
          scale: 1.5,
          color: '#4dabf7',
          textShadow: '0 0 20px rgba(77, 171, 247, 0.8)',
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      letter.addEventListener('mouseleave', () => {
        gsap.to(letter, {
          scale: 1,
          color: 'white',
          textShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)',
          duration: 0.3,
          ease: "power2.in"
        });
      });
    });


    mainTimeline.fromTo(
      buttonRef.current,
      { 
        scale: 0,
        rotation: -180 
      },
      {
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      },
      "-=0.5"
    );


    const gifTimeline = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power1.inOut" }
    });

    gifTimeline
      .to(gifRef.current, {
        y: -15,
        rotation: 5,
        duration: 1.5
      })
      .to(gifRef.current, {
        y: 0,
        rotation: -5,
        duration: 1.5
      })
      .to(gifRef.current, {
        scale: 1.1,
        duration: 0.5
      })
      .to(gifRef.current, {
        scale: 1,
        duration: 0.5
      });

  
    return () => {
      mainTimeline.kill();
      waveTimeline.kill();
      gifTimeline.kill();
    };
  }, []);


  const handleButtonHover = (enter) => {
    gsap.to(buttonRef.current, {
      scale: enter ? 1.1 : 1,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        modules={[Autoplay, Pagination]}
        className="w-full h-full"
        onSlideChange={() => {
          gsap.fromTo(
            ".slide-text",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }}
      >
        {bannerSliderLists.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${ImagePathRoutes.BannerOfferPostImagePath + slide.Imagepath})`
              }}
            >
              <div className="slide-text absolute top-1/2  transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-20"  style={{left:"750px" }}>
                <h2 className="text-4xl md:text-4xl font-bold mb-4">{slide.OfferName}</h2>
                <p className="text-xl mb-6">{slide.OfferDescription}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent z-10"
      />
      <div
        ref={gifRef}
        className="absolute bottom-10 right-10 transform z-20 
                   rounded-lg overflow-hidden shadow-2xl
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]
                   transition-shadow duration-300"
        style={{
          width: "180px",
          height: "180px",
          position: "relative",
          background: "rgba(0,0,0,0.1)",
          backdropFilter: "blur(5px)",
        }}
      >
        <iframe
          src="https://giphy.com/embed/kG43Pr7YB5jDtjQKs3"
          width="100%"
          height="100%"
          frameBorder="0"
          className="giphy-embed rounded-lg"y
          allowFullScreen
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-20">
        <h1
          ref={textRef}
          className="text-4xl md:text-5xl font-bold mb-11 [text-shadow:_2px_2px_10px_rgb(0_0_0_/_50%)]"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "center"
          }}
        >
       
        </h1>
    
      </div>
    </div>
  );
};

export default Banner;
