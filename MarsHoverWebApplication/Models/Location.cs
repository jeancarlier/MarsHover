using MarsRoverWebApplication.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarsRoverWebApplication.Models
{
    public class Location : ILocation
    {
        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public HeadTo HeadingTo { get; set; }
        public string NavigationSteps { get; set; }
        public DateTime MovimentTime { get; set; }

        private string[] maxGridSize;

        public string[] MaxGridSize
        {
            get { return maxGridSize; }
            set { maxGridSize = value; }
        }

        public Rover Rover { get; set; }

        public Location()
        {
            X = 0;
            Y = 0;
            HeadingTo = HeadTo.N;
        }

        public Location(string[] location)
        {
            int posX, posY = -1;
            int.TryParse(location[0], out posX);
            int.TryParse(location[1], out posY);

            X = posX; 
            Y = posY;

            HeadingTo = (HeadTo)Enum.Parse(typeof(HeadTo), location[2]);
        }

        public enum HeadTo
        {
            N = 1,
            W = 2,
            S = 3,
            E = 4
        }

        private void ChangeDirection(char direction)
        {
            switch (HeadingTo)
            {
                case HeadTo.N:
                    HeadingTo = direction == 'L' ? HeadTo.W : HeadTo.E;
                    break;
                case HeadTo.E:
                    HeadingTo = direction == 'L' ? HeadTo.N : HeadTo.S;
                    break;
                case HeadTo.S:
                    HeadingTo = direction == 'L' ? HeadTo.E : HeadTo.W;
                    break;
                case HeadTo.W:
                    HeadingTo = direction == 'L' ? HeadTo.S : HeadTo.N;
                    break;
            }
        }

        private void Advance()
        {
            switch (HeadingTo)
            {
                case HeadTo.N:
                    Y++;
                    break;
                case HeadTo.W:
                    X--;
                    break;
                case HeadTo.S:
                    Y--;
                    break;
                case HeadTo.E:
                    X++;
                    break;
                default:
                    break;
            }
        }

        private void Move(char movement)
        {
            switch (movement)
            {
                case 'L':
                    ChangeDirection(movement);
                    break;
                case 'R':
                    ChangeDirection(movement);
                    break;
                case 'M':
                    Advance();
                    break;
            }
        }

        public string CalculateFinalPosition(string input)
        {
            var charInput = input.ToCharArray();

            for (int i = 0; i < charInput.Length; i++)
            {
                Move(charInput[i]);
            }

            if (X > Int32.Parse(maxGridSize[0]) || X < 0)
                throw new Exception("Navigation out of bounds. X axis exceeded the limit. Please restart!");

            if (Y > Int32.Parse(maxGridSize[1]) || Y < 0)
                throw new Exception("Navigation out of bounds. Y axis exceeded the limit. Please restart!");

            return X + " " + Y + " " + HeadingTo;
        }
    }
}