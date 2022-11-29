<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum HardinessZone: string
{
	use FilterableEnum;

	case ZeroA = '0a';
	case ZeroB = '0b';
	case OneA = '1a';
	case OneB = '1b';
	case TwoA = '2a';
	case TwoB = '2b';
	case ThreeA = '3a';
	case ThreeB = '3b';
	case FourA = '4a';
	case FourB = '4b';
	case FiveA = '5a';
	case FiveB = '5b';
	case SixA = '6a';
	case SixB = '6b';
	case SevenA = '7a';
	case SevenB = '7b';
	case EightA = '8a';
	case EightB = '8b';
	case NineA = '9a';
	case NineB = '9b';
	case TenA = '10a';
	case TenB = '10b';
	case ElevenA = '11a';
	case ElevenB = '11b';
	case TwelveA = '12a';
	case TwelveB = '12b';
	case ThirteenA = '13a';
	case ThirteenB = '13b';

	public function order(): int
	{
		return match ($this) {
			self::ZeroA => 1,
			self::ZeroB => 2,
			self::OneA => 3,
			self::OneB => 4,
			self::TwoA => 5,
			self::TwoB => 6,
			self::ThreeA => 7,
			self::ThreeB => 8,
			self::FourA => 9,
			self::FourB => 10,
			self::FiveA => 11,
			self::FiveB => 12,
			self::SixA => 13,
			self::SixB => 14,
			self::SevenA => 15,
			self::SevenB => 16,
			self::EightA => 17,
			self::EightB => 18,
			self::NineA => 19,
			self::NineB => 20,
			self::TenA => 21,
			self::TenB => 22,
			self::ElevenA => 23,
			self::ElevenB => 24,
			self::TwelveA => 25,
			self::TwelveB => 26,
			self::ThirteenA => 27,
			self::ThirteenB => 28
		};
	}

	private function format(float $celsiusValue, string $unit = 'c'): float
	{
		return $unit === 'f' ? ($celsiusValue * 1.8) + 32 : $celsiusValue;
	}

	public function lowerTemp(string $unit = 'c'): float
	{
		return $this->format(
			match ($this) {
				self::ZeroA => -100,
				self::ZeroB => -53.9,
				self::OneA => -51.1,
				self::OneB => -48.3,
				self::TwoA => -45.6,
				self::TwoB => -42.8,
				self::ThreeA => -40,
				self::ThreeB => -37.2,
				self::FourA => -34.4,
				self::FourB => -31.7,
				self::FiveA => -28.9,
				self::FiveB => -26.1,
				self::SixA => -23.3,
				self::SixB => -20.6,
				self::SevenA => -17.8,
				self::SevenB => -15,
				self::EightA => -12.2,
				self::EightB => -9.4,
				self::NineA => -6.7,
				self::NineB => -3.9,
				self::TenA => -1.1,
				self::TenB => 1.7,
				self::ElevenA => 4.4,
				self::ElevenB => 7.2,
				self::TwelveA => 10,
				self::TwelveB => 12.8,
				self::ThirteenA => 15.6,
				self::ThirteenB => 18.3,
			}, $unit);
	}

	public function upperTemp(string $unit = 'c'): float
	{
		return $this->format(match ($this) {
			self::ZeroA => -53.9,
			self::ZeroB => -51.1,
			self::OneA => -48.3,
			self::OneB => -45.6,
			self::TwoA => -42.8,
			self::TwoB => -40,
			self::ThreeA => -37.2,
			self::ThreeB => -34.4,
			self::FourA => -31.7,
			self::FourB => -28.9,
			self::FiveA => -26.1,
			self::FiveB => -23.3,
			self::SixA => -20.6,
			self::SixB => -17.8,
			self::SevenA => -15,
			self::SevenB => -12.2,
			self::EightA => -9.4,
			self::EightB => -6.7,
			self::NineA => -3.9,
			self::NineB => -1.1,
			self::TenA => 1.7,
			self::TenB => 4.4,
			self::ElevenA => 7.2,
			self::ElevenB => 10,
			self::TwelveA => 12.8,
			self::TwelveB => 15.6,
			self::ThirteenA => 18.3,
			self::ThirteenB => 100
		}, $unit);
	}

	public function getTemperatureRange(): array
	{
		return ['lower' => $this->lowerTemp('f'), 'upper' => $this->upperTemp('f')];
	}

	public function label(): string
	{
		return $this->value;
	}
}
